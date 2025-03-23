let map;
let isOfflineMode = false;
let searchMarker = null;
let cachedLocations = new Map();

// 将经纬度转换为瓦片坐标
function project(latlng, zoom) {
    const lat = latlng.lat * Math.PI / 180;
    const lng = latlng.lng * Math.PI / 180;
    const n = Math.pow(2, zoom);

    return {
        x: ((lng + Math.PI) / (2 * Math.PI)) * n,
        y: ((1 - Math.log(Math.tan(lat) + 1 / Math.cos(lat)) / Math.PI) / 2) * n
    };
}

// 切换离线模式
function toggleOfflineMode() {
    isOfflineMode = !isOfflineMode;
    if (isOfflineMode) {
        // 使用缓存的瓦片
        map.eachLayer(layer => {
            if (layer instanceof L.TileLayer) {
                map.removeLayer(layer);
            }
        });

        const offlineLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors',
            crossOrigin: true
        });

        offlineLayer.addTo(map);
    } else {
        // 重新加载在线地图
        initMap();
    }
}

// 关闭控制面板
function closePanel() {
    const controlPanel = document.querySelector('.control-panel');
    controlPanel.style.display = 'none';
}

// 切换控制面板的缩放状态
function toggleMinimize() {
    const controlPanel = document.querySelector('.control-panel');
    controlPanel.classList.toggle('minimized');
}

// 初始化地图
function initMap() {
    map = L.map('map').setView([35.86166, 104.195397], 4);

    // 使用OpenStreetMap图层
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    });

    osmLayer.addTo(map);

    // 添加地图移动事件监听器，更新搜索框位置
    map.on('moveend', function() {
        const controlPanel = document.querySelector('.control-panel');
        if (controlPanel.style.display === 'block' && controlPanel.dataset.markerLat && controlPanel.dataset.markerLon) {
            const lat = parseFloat(controlPanel.dataset.markerLat);
            const lon = parseFloat(controlPanel.dataset.markerLon);
            const point = map.latLngToContainerPoint([lat, lon]);
            
            const mapWidth = map.getSize().x;
            const mapHeight = map.getSize().y;
            const panelWidth = 320;
            const panelHeight = 200;
            
            // 计算新的位置
            const leftPos = Math.min(point.x + 20, mapWidth - panelWidth - 20);
            let topPos;
            if (point.y + panelHeight + 30 > mapHeight) {
                topPos = point.y - panelHeight - 10;
            } else {
                topPos = point.y + 30;
            }
            
            // 更新搜索框位置
            controlPanel.style.left = leftPos + 'px';
            controlPanel.style.top = topPos + 'px';
        }
    });

    // 添加地图点击事件监听器
    map.on('click', async function(e) {
        const lat = e.latlng.lat;
        const lon = e.latlng.lng;
        
        // 检查点击位置是否在中国区域内
        if (lat < 18 || lat > 53 || lon < 73 || lon > 135) {
            alert('抱歉，当前仅支持查询中国区域内的地点信息');
            return;
        }
        
        const locationKey = `${lat},${lon}`;

        // 检查缓存
        if (isOfflineMode && cachedLocations.has(locationKey)) {
            const cachedData = cachedLocations.get(locationKey);
            updateMapMarkers(cachedData);
            return;
        }
        
        try {
            // 使用Nominatim API搜索周边地点
            const data = await fetchWithRetry(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
            );
            
            if (!data || !data.display_name) {
                alert('未找到该地点信息');
                return;
            }

            // 移除之前的标记
            if (searchMarker) {
                map.removeLayer(searchMarker);
            }

            // 添加新标记
            searchMarker = L.marker([lat, lon])
                .addTo(map)
                .bindPopup(data.display_name)
                .openPopup();
            
            // 显示并定位搜索框
            const controlPanel = document.querySelector('.control-panel');
            const point = map.latLngToContainerPoint([lat, lon]);
            controlPanel.style.display = 'block';
            const mapWidth = map.getSize().x;
            const mapHeight = map.getSize().y;
            const panelWidth = 320;
            const panelHeight = 200; // 估算搜索框高度
            const leftPos = Math.min(point.x + 20, mapWidth - panelWidth - 20);
            
            // 根据点击位置调整搜索框的垂直位置
            let topPos;
            if (point.y + panelHeight + 30 > mapHeight) {
                // 如果点击位置靠近底部，将搜索框显示在上方
                topPos = Math.max(10, point.y - panelHeight - 10); // 确保不会超出顶部
            } else {
                // 否则显示在下方
                topPos = Math.min(point.y + 30, mapHeight - panelHeight - 10); // 确保不会超出底部
            }
            
            controlPanel.style.left = leftPos + 'px';
            controlPanel.style.top = topPos + 'px';
            
            // 存储当前标记位置，用于地图移动时更新搜索框位置
            controlPanel.dataset.markerLat = lat;
            controlPanel.dataset.markerLon = lon;

            // 搜索周边兴趣点
            const nearbyData = await fetchWithRetry(
                `https://nominatim.openstreetmap.org/search?format=json&q=point&lat=${lat}&lon=${lon}&radius=1000&limit=10`
            );

            // 显示周边地点
            nearbyData.forEach(place => {
                L.marker([place.lat, place.lon])
                    .addTo(map)
                    .bindPopup(place.display_name);
            });

            // 缓存搜索结果
            cachedLocations.set(locationKey, {
                lat,
                lon,
                display_name: data.display_name,
                nearby: nearbyData
            });
        } catch (error) {
            console.error('搜索失败:', error);
            alert('搜索失败，请稍后重试');
        }
    });
}

let lastRequestTime = 0;

const MIN_REQUEST_INTERVAL = 1000; // 最小请求间隔（毫秒）
const MAX_RETRIES = 3; // 最大重试次数

// 添加延迟函数
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 添加请求重试函数
async function fetchWithRetry(url, retries = MAX_RETRIES) {
    for (let i = 0; i < retries; i++) {
        try {
            // 确保请求间隔
            const now = Date.now();
            const timeSinceLastRequest = now - lastRequestTime;
            if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
                await delay(MIN_REQUEST_INTERVAL - timeSinceLastRequest);
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            lastRequestTime = Date.now();
            return await response.json();
        } catch (error) {
            if (i === retries - 1) throw error;
            await delay(Math.pow(2, i) * 1000); // 指数退避
        }
    }
}

// 更新地图标记的函数
function updateMapMarkers(data) {
    // 移除之前的标记
    if (searchMarker) {
        map.removeLayer(searchMarker);
    }

    // 添加新标记
    searchMarker = L.marker([data.lat, data.lon])
        .addTo(map)
        .bindPopup(data.display_name)
        .openPopup();

    // 显示周边地点
    if (data.nearby && Array.isArray(data.nearby)) {
        data.nearby.forEach(place => {
            L.marker([place.lat, place.lon])
                .addTo(map)
                .bindPopup(place.display_name);
        });
    }
}

// 下载地图数据
async function downloadTiles() {
    if (!('caches' in window)) {
        alert('您的浏览器不支持缓存API，无法使用离线功能');
        return;
    }

    const bounds = map.getBounds();
    const zoom = map.getZoom();
    const cache = await caches.open('map-tiles');

    // 获取当前视图内的瓦片URL
    const urls = [];
    const progressElement = document.getElementById('progress');

    // 计算瓦片坐标
    const minTile = project(bounds.getSouthWest(), zoom);
    const maxTile = project(bounds.getNorthEast(), zoom);

    for (let x = Math.floor(minTile.x); x <= Math.ceil(maxTile.x); x++) {
        for (let y = Math.floor(minTile.y); y <= Math.ceil(maxTile.y); y++) {
            const tileUrl = `https://a.tile.openstreetmap.org/${zoom}/${x}/${y}.png`;
            urls.push(tileUrl);
        }
    }

    // 缓存瓦片
    try {
        let downloaded = 0;
        progressElement.textContent = `正在下载: 0/${urls.length}`;

        await Promise.all(urls.map(async url => {
            await cache.add(url);
            downloaded++;
            progressElement.textContent = `正在下载: ${downloaded}/${urls.length}`;
        }));

        progressElement.textContent = '地图数据下载完成';
    } catch (error) {
        console.error('下载地图数据失败:', error);
        progressElement.textContent = '下载地图数据失败';
    }
}

// 搜索地点
async function searchLocation() {
    const searchInput = document.getElementById('searchInput').value.trim();
    if (!searchInput) return;

    try {
        let location;
        if (isOfflineMode && cachedLocations.has(searchInput)) {
            location = cachedLocations.get(searchInput);
        } else {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchInput)}`);
            const data = await response.json();
            
            if (data.length === 0) {
                alert('未找到该地点');
                return;
            }

            location = {
                lat: parseFloat(data[0].lat),
                lon: parseFloat(data[0].lon),
                display_name: data[0].display_name
            };

            // 缓存搜索结果
            cachedLocations.set(searchInput, location);
        }

        // 移除之前的标记
        if (searchMarker) {
            map.removeLayer(searchMarker);
        }

        // 添加新标记
        searchMarker = L.marker([location.lat, location.lon])
            .addTo(map)
            .bindPopup(location.display_name)
            .openPopup();

        // 将地图视图移动到搜索位置
        map.setView([location.lat, location.lon], 13);
    } catch (error) {
        console.error('搜索失败:', error);
        alert('搜索失败，请稍后重试');
    }
}

// 周边搜索函数
async function searchNearby() {
    const searchInput = document.getElementById('nearbySearchInput').value;
    const radius = document.getElementById('searchRadius').value;

    if (!searchInput || !radius) {
        alert('请输入搜索关键词和半径');
        return;
    }

    if (isOfflineMode && !cachedLocations.has(searchInput)) {
        alert('离线模式下无法搜索新地点');
        return;
    }

    try {
        // 先搜索输入的地点
        const searchUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchInput)}&limit=1`;
        const searchData = await fetchWithRetry(searchUrl);

        if (!searchData || searchData.length === 0) {
            alert('未找到该地点');
            return;
        }

        const location = searchData[0];
        const nearbyUrl = `https://nominatim.openstreetmap.org/search?format=json&q=&lat=${location.lat}&lon=${location.lon}&radius=${radius}&limit=10`;
        const nearbyData = await fetchWithRetry(nearbyUrl);

        // 清除之前的标记
        if (searchMarker) {
            map.removeLayer(searchMarker);
        }

        // 添加搜索位置标记
        searchMarker = L.marker([location.lat, location.lon])
            .addTo(map)
            .bindPopup(location.display_name)
            .openPopup();

        // 添加周边位置标记
        nearbyData.forEach(place => {
            if (place.place_id !== location.place_id) {
                L.marker([place.lat, place.lon])
                    .addTo(map)
                    .bindPopup(place.display_name);
            }
        });

        // 调整地图视图以显示所有标记
        const bounds = L.latLngBounds([[location.lat, location.lon]]);
        nearbyData.forEach(place => {
            bounds.extend([place.lat, place.lon]);
        });
        map.fitBounds(bounds, { padding: [50, 50] });

        // 缓存搜索结果
        if (!isOfflineMode) {
            cachedLocations.set(searchInput, {
                center: location,
                nearby: nearbyData
            });
        }
    } catch (error) {
        console.error('搜索出错:', error);
        alert('搜索失败，请稍后重试');
    }
}

// 初始化地图
initMap();