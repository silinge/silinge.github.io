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
        
        // 先显示控制面板，确保即使网络请求失败也能看到搜索框
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
        
        try {
            // 移除之前的标记
            if (searchMarker) {
                map.removeLayer(searchMarker);
            }

            // 添加新标记，即使没有获取到地点信息也先显示一个标记
            searchMarker = L.marker([lat, lon]).addTo(map);
            
            // 检查网络连接状态
            if (!navigator.onLine) {
                throw new Error('网络连接已断开，请检查您的网络设置');
            }
            
            // 使用Nominatim API搜索周边地点
            const data = await fetchWithRetry(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
            );
            
            if (!data || !data.display_name) {
                searchMarker.bindPopup('未找到该地点信息').openPopup();
                return;
            }

            // 更新标记信息
            searchMarker.bindPopup(data.display_name).openPopup();

            // 搜索周边兴趣点
            try {
                const nearbyData = await fetchWithRetry(
                    `https://nominatim.openstreetmap.org/search?format=json&q=point&lat=${lat}&lon=${lon}&radius=1000&limit=10`
                );

                // 显示周边地点
                if (nearbyData && Array.isArray(nearbyData)) {
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
                }
            } catch (nearbyError) {
                console.warn('周边搜索失败:', nearbyError);
                // 即使周边搜索失败，也缓存主要地点信息
                cachedLocations.set(locationKey, {
                    lat,
                    lon,
                    display_name: data.display_name,
                    nearby: []
                });
            }
        } catch (error) {
            console.error('搜索失败:', error);
            if (searchMarker) {
                searchMarker.bindPopup(`搜索失败: ${error.message}`).openPopup();
            }
            // 即使搜索失败，控制面板也已经显示，用户可以使用其他功能
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

            // 检查网络连接状态
            if (!navigator.onLine) {
                throw new Error('网络连接已断开，请检查您的网络设置');
            }

            // 设置超时
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            
            try {
                console.log(`正在请求: ${url}`);
                const response = await fetch(url, { signal: controller.signal });
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    // 对于400错误，尝试记录更多信息
                    if (response.status === 400) {
                        console.error(`请求参数错误(400)，URL: ${url}`);
                        // 尝试获取错误详情
                        try {
                            const errorText = await response.text();
                            console.error(`错误详情: ${errorText}`);
                        } catch (e) {
                            console.error('无法获取错误详情');
                        }
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                lastRequestTime = Date.now();
                return await response.json();
            } catch (fetchError) {
                clearTimeout(timeoutId);
                throw fetchError;
            }
        } catch (error) {
            console.warn(`请求失败 (尝试 ${i+1}/${retries}): ${error.message}`);
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
    if (!searchInput) {
        alert('请输入搜索内容');
        return;
    }

    // 确保控制面板显示
    const controlPanel = document.querySelector('.control-panel');
    if (controlPanel.style.display !== 'block') {
        controlPanel.style.display = 'block';
    }

    try {
        // 检查网络连接状态
        if (!navigator.onLine && !isOfflineMode) {
            throw new Error('网络连接已断开，请检查您的网络设置或切换到离线模式');
        }

        let location;
        if (isOfflineMode && cachedLocations.has(searchInput)) {
            location = cachedLocations.get(searchInput);
        } else if (isOfflineMode) {
            throw new Error('离线模式下无法搜索新地点，请切换到在线模式或搜索已缓存的地点');
        } else {
            try {
                const data = await fetchWithRetry(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchInput)}`);
                
                if (!data || data.length === 0) {
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
            } catch (fetchError) {
                console.error('API请求失败:', fetchError);
                throw new Error(`地点搜索失败: ${fetchError.message}`);
            }
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
        
        // 更新控制面板位置数据
        const point = map.latLngToContainerPoint([location.lat, location.lon]);
        controlPanel.dataset.markerLat = location.lat;
        controlPanel.dataset.markerLon = location.lon;
    } catch (error) {
        console.error('搜索失败:', error);
        alert(`搜索失败: ${error.message}`);
    }
}

// 周边搜索函数
async function searchNearby() {
    const searchInput = document.getElementById('nearbySearchInput').value;
    const radius = document.getElementById('searchRadius').value;
    const centerType = document.getElementById('searchCenterType').value;
    const poiCategory = document.getElementById('poiCategory').value;

    if (!radius) {
        alert('请输入搜索半径');
        return;
    }

    // 确保控制面板显示
    const controlPanel = document.querySelector('.control-panel');
    if (controlPanel.style.display !== 'block') {
        controlPanel.style.display = 'block';
    }

    // 清除之前的所有POI标记
    clearAllPOIMarkers();

    try {
        // 检查网络连接状态
        if (!navigator.onLine && !isOfflineMode) {
            throw new Error('网络连接已断开，请检查您的网络设置或切换到离线模式');
        }

        let centerLat, centerLon, centerName;

        // 根据选择的中心点类型确定搜索中心
        switch (centerType) {
            case 'current':
                // 使用当前地图中心
                const mapCenter = map.getCenter();
                centerLat = mapCenter.lat;
                centerLon = mapCenter.lng;
                centerName = '当前地图中心';
                break;
            case 'marker':
                // 使用已标记位置
                if (!searchMarker) {
                    alert('请先在地图上标记一个位置');
                    return;
                }
                const markerPos = searchMarker.getLatLng();
                centerLat = markerPos.lat;
                centerLon = markerPos.lng;
                centerName = searchMarker.getPopup() ? searchMarker.getPopup().getContent() : '已标记位置';
                break;
            case 'custom':
                // 使用自定义位置（通过搜索）
                if (!searchInput) {
                    alert('请输入搜索地点');
                    return;
                }

                // 检查离线模式
                if (isOfflineMode) {
                    if (cachedLocations.has(searchInput)) {
                        const cachedLocation = cachedLocations.get(searchInput);
                        centerLat = cachedLocation.lat;
                        centerLon = cachedLocation.lon;
                        centerName = cachedLocation.display_name;
                    } else {
                        alert('离线模式下无法搜索新地点，请切换到在线模式或搜索已缓存的地点');
                        return;
                    }
                } else {
                    try {
                        // 搜索输入的地点
                        const searchUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchInput)}&limit=1`;
                        const searchData = await fetchWithRetry(searchUrl);

                        if (!searchData || searchData.length === 0) {
                            alert('未找到该地点');
                            return;
                        }

                        const location = searchData[0];
                        centerLat = parseFloat(location.lat);
                        centerLon = parseFloat(location.lon);
                        centerName = location.display_name;
                    } catch (searchError) {
                        console.error('地点搜索失败:', searchError);
                        throw new Error(`地点搜索失败: ${searchError.message}`);
                    }
                }
                break;
        }

        // 构建POI类别查询参数
        let categoryParam = '';
        if (poiCategory !== 'all') {
            const categoryMap = {
                'food': 'amenity=restaurant,cafe,fast_food',
                'hotel': 'tourism=hotel,hostel,guest_house',
                'shopping': 'shop=mall,supermarket,convenience',
                'transport': 'amenity=bus_station,parking,fuel',
                'tourism': 'tourism=attraction,museum,viewpoint'
            };
            categoryParam = `&${categoryMap[poiCategory]}`;
        }

        // 检查缓存中是否有周边搜索结果
        const cacheKey = `${centerLat},${centerLon},${radius},${poiCategory}`;
        if (isOfflineMode && cachedLocations.has(cacheKey)) {
            const cachedData = cachedLocations.get(cacheKey);
            displayNearbyResults(cachedData.center, cachedData.nearby, centerType);
            return;
        }

        // 在线模式下进行周边搜索
        if (!isOfflineMode) {
            try {
                // 构建周边搜索URL - 使用viewbox参数代替radius
                // 根据中心点和半径计算边界框
                const radiusInDegrees = radius / 111000; // 粗略转换米到度（1度约等于111公里）
                const minLat = centerLat - radiusInDegrees;
                const maxLat = centerLat + radiusInDegrees;
                const minLon = centerLon - radiusInDegrees / Math.cos(centerLat * Math.PI / 180);
                const maxLon = centerLon + radiusInDegrees / Math.cos(centerLat * Math.PI / 180);
                
                // 构建使用viewbox的URL - 按照Nominatim API要求的格式：min_lon,min_lat,max_lon,max_lat
                // 添加q参数，因为viewbox需要配合搜索关键词使用
                let searchKeyword = '';
                if (poiCategory !== 'all') {
                    // 如果选择了特定类别，使用该类别作为搜索关键词
                    searchKeyword = document.getElementById('poiCategory').options[document.getElementById('poiCategory').selectedIndex].text;
                } else {
                    // 默认搜索所有兴趣点
                    searchKeyword = 'amenity';
                }
                const nearbyUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchKeyword)}${categoryParam}&viewbox=${minLon},${minLat},${maxLon},${maxLat}&bounded=1&limit=15`;
                console.log('周边搜索URL:', nearbyUrl);
                const nearbyData = await fetchWithRetry(nearbyUrl);

                // 如果没有找到周边POI
                if (!nearbyData || nearbyData.length === 0) {
                    alert(`在${radius}米范围内未找到${poiCategory === 'all' ? '' : document.getElementById('poiCategory').options[document.getElementById('poiCategory').selectedIndex].text}相关地点`);
                    return;
                }

                // 显示搜索结果
                displayNearbyResults(
                    { lat: centerLat, lon: centerLon, display_name: centerName },
                    nearbyData,
                    centerType
                );

                // 缓存搜索结果
                cachedLocations.set(cacheKey, {
                    center: { lat: centerLat, lon: centerLon, display_name: centerName },
                    nearby: nearbyData
                });
            } catch (nearbyError) {
                console.error('周边搜索失败:', nearbyError);
                // 提供更友好的错误信息
                let errorMessage = `周边搜索失败: ${nearbyError.message}`;
                
                // 针对常见错误提供更具体的提示
                if (nearbyError.message.includes('400')) {
                    errorMessage = '周边搜索参数错误，请尝试减小搜索半径或选择其他位置';
                } else if (nearbyError.message.includes('429')) {
                    errorMessage = '请求过于频繁，请稍后再试';
                } else if (nearbyError.message.includes('timeout')) {
                    errorMessage = '搜索超时，请检查网络连接或稍后再试';
                }
                
                alert(errorMessage);
                throw new Error(errorMessage);
            }
        } else {
            alert('离线模式下无法进行新的周边搜索，请切换到在线模式');
        }
    } catch (error) {
        console.error('搜索出错:', error);
        alert(`搜索失败: ${error.message}`);
    }
}

// 显示周边搜索结果
function displayNearbyResults(center, nearbyData, centerType) {
    // 清除之前的中心点标记（如果不是使用已有标记）
    if (centerType !== 'marker' && searchMarker) {
        map.removeLayer(searchMarker);
    }

    // 如果没有中心点标记，添加一个
    if (!searchMarker) {
        searchMarker = L.marker([center.lat, center.lon])
            .addTo(map)
            .bindPopup(center.display_name)
            .openPopup();
    }

    // 添加周边位置标记，使用不同颜色区分不同类型
    const poiMarkers = [];
    nearbyData.forEach((place, index) => {
        if (place.place_id !== (searchMarker ? searchMarker.place_id : null)) {
            // 根据POI类型设置不同颜色
            const markerColor = getMarkerColorByCategory(place, document.getElementById('poiCategory').value);
            
            // 创建自定义图标
            const customIcon = L.divIcon({
                className: 'poi-marker',
                html: `<div class="poi-marker-icon" style="background-color: ${markerColor}">${index + 1}</div>`,
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            });
            
            // 创建标记并添加到地图
            const marker = L.marker([place.lat, place.lon], {icon: customIcon})
                .addTo(map)
                .bindPopup(`<strong>${place.display_name}</strong><br>距离中心点: ${calculateDistance(center.lat, center.lon, place.lat, place.lon).toFixed(0)}米`);
            
            poiMarkers.push(marker);
        }
    });

    // 保存POI标记到全局变量，方便后续清除
    window.currentPOIMarkers = poiMarkers;

    // 调整地图视图以显示所有标记
    if (nearbyData.length > 0) {
        const bounds = L.latLngBounds([[center.lat, center.lon]]);
        nearbyData.forEach(place => {
            bounds.extend([place.lat, place.lon]);
        });
        map.fitBounds(bounds, { padding: [50, 50] });
    }
}

// 清除所有POI标记
function clearAllPOIMarkers() {
    // 清除之前添加的POI标记
    if (window.currentPOIMarkers && window.currentPOIMarkers.length) {
        window.currentPOIMarkers.forEach(marker => {
            map.removeLayer(marker);
        });
        window.currentPOIMarkers = [];
    }
}

// 根据POI类别设置标记颜色
function getMarkerColorByCategory(place, selectedCategory) {
    // 默认颜色
    let color = '#3388ff';
    
    // 根据POI类型设置颜色
    if (place.class === 'amenity') {
        if (['restaurant', 'cafe', 'fast_food'].includes(place.type)) {
            color = '#e74c3c'; // 红色 - 餐饮
        } else if (['parking', 'bus_station', 'fuel'].includes(place.type)) {
            color = '#3498db'; // 蓝色 - 交通
        }
    } else if (place.class === 'shop') {
        color = '#9b59b6'; // 紫色 - 购物
    } else if (place.class === 'tourism') {
        color = '#2ecc71'; // 绿色 - 旅游
    } else if (place.class === 'building' && ['hotel', 'hostel'].includes(place.type)) {
        color = '#f39c12'; // 橙色 - 住宿
    }
    
    // 如果选择了特定类别，使用该类别的颜色
    if (selectedCategory !== 'all') {
        const categoryColors = {
            'food': '#e74c3c',
            'hotel': '#f39c12',
            'shopping': '#9b59b6',
            'transport': '#3498db',
            'tourism': '#2ecc71'
        };
        color = categoryColors[selectedCategory];
    }
    
    return color;
}

// 计算两点之间的距离（米）
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // 地球半径（米）
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance;
}

// 初始化地图
initMap();