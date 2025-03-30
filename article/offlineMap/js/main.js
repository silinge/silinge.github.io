// 初始化地图
const map = L.map('map').setView([39.9042, 116.4074], 13); // 默认显示北京中心

// 使用OpenStreetMap的离线瓦片图层
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors',
    tileSize: 256,
    zoomOffset: 0,
    subdomains: ['a', 'b', 'c']
}).addTo(map);

// 添加离线缓存功能
const cache = new Map();

// 添加请求头
const headers = {
    'User-Agent': 'OfflineMapApp/1.0',
    'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'Referer': window.location.href
};

// 路线管理
let routePoints = [];
let routeLine = null;
let routeMarkers = [];
let tempMarker = null;
let selectedTransport = 'walking'; // 默认出行方式

// 出行方式图标映射
const transportIcons = {
    walking: 'fa-walking',
    bicycle: 'fa-bicycle',
    swimming: 'fa-swimmer',
    motorcycle: 'fa-motorcycle',
    truck: 'fa-truck',
    bus: 'fa-bus',
    train: 'fa-train',
    'high-speed-train': 'fa-train',
    plane: 'fa-plane',
    ship: 'fa-ship',
    car: 'fa-car',
    subway: 'fa-subway'
};

// 出行方式颜色映射
const transportColors = {
    walking: '#4CAF50',
    bicycle: '#2196F3',
    swimming: '#00BCD4',
    motorcycle: '#FF9800',
    truck: '#795548',
    bus: '#9C27B0',
    train: '#607D8B',
    'high-speed-train': '#E91E63',
    plane: '#F44336',
    ship: '#3F51B5',
    car: '#FF5722',
    subway: '#673AB7'
};

// 动画相关变量
let animationFrame = null;
let currentProgress = 0;
let isPlaying = false;
let animationSpeed = 5;
let animationMarker = null;
let animationCanvas = null;
let animationCtx = null;
let animationFrames = [];
let isCapturing = false;

// 动画控制
const playButton = document.getElementById('play-animation');
const pauseButton = document.getElementById('pause-animation');
const resetButton = document.getElementById('reset-animation');
const saveButton = document.getElementById('save-animation');
const speedSlider = document.getElementById('animation-speed');
const speedValue = document.getElementById('speed-value');
const progressBar = document.getElementById('animation-progress');

// 初始化动画画布
function initAnimationCanvas() {
    animationCanvas = document.getElementById('animation-canvas');
    animationCtx = animationCanvas.getContext('2d');
    animationCanvas.width = map.getContainer().offsetWidth;
    animationCanvas.height = map.getContainer().offsetHeight;
}

// 更新动画速度
speedSlider.addEventListener('input', (e) => {
    animationSpeed = parseInt(e.target.value);
    speedValue.textContent = `${animationSpeed}x`;
});

// 播放动画
playButton.addEventListener('click', () => {
    if (!isPlaying && routePoints.length > 1) {
        isPlaying = true;
        playAnimation();
    }
});

// 动画播放函数
function playAnimation() {
    if (!isPlaying || routePoints.length <= 1) return;

    const totalPoints = routePoints.length;
    const totalSegments = totalPoints - 1;
    const progressPerFrame = (1 / (500 * animationSpeed)) * totalSegments;
    
    currentProgress += progressPerFrame;
    
    if (currentProgress >= 1) {
        currentProgress = 0;
        isPlaying = false;
        return;
    }

    // 计算当前位置
    const currentSegment = Math.floor(currentProgress * totalSegments);
    const segmentProgress = (currentProgress * totalSegments) % 1;
    
    const startPoint = routePoints[currentSegment];
    const endPoint = routePoints[currentSegment + 1];
    
    const lat = startPoint.lat + (endPoint.lat - startPoint.lat) * segmentProgress;
    const lon = startPoint.lon + (endPoint.lon - startPoint.lon) * segmentProgress;
    
    // 更新动画标记
    if (animationMarker) {
        map.removeLayer(animationMarker);
    }
    
    // 获取当前路段的出行方式
    const currentTransport = routePoints[currentSegment].transport;
    
    animationMarker = L.marker([lat, lon], {
        icon: L.divIcon({
            className: 'custom-marker',
            html: `<i class="fas ${transportIcons[currentTransport]}" style="color: ${transportColors[currentTransport]}; font-size: 24px;"></i>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        })
    }).addTo(map);
    
    // 更新进度条
    progressBar.style.width = `${currentProgress * 100}%`;
    
    // 继续动画
    animationFrame = requestAnimationFrame(playAnimation);
}

// 暂停动画
pauseButton.addEventListener('click', () => {
    isPlaying = false;
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
    }
});

// 重置动画
resetButton.addEventListener('click', () => {
    isPlaying = false;
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
    }
    currentProgress = 0;
    progressBar.style.width = '0%';
    if (animationMarker) {
        map.removeLayer(animationMarker);
    }
});

// 保存动画
saveButton.addEventListener('click', async () => {
    if (routePoints.length <= 1) {
        alert('请先创建路线');
        return;
    }

    if (isCapturing) {
        alert('正在生成动画，请稍候...');
        return;
    }

    isCapturing = true;
    saveButton.disabled = true;
    saveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 生成中...';

    try {
        // 初始化画布
        initAnimationCanvas();
        animationFrames = [];
        
        // 等待地图瓦片加载完成
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 计算总帧数
        const totalFrames = 30;
        const fps = 15;
        const frameInterval = 1000 / fps;
        
        console.log('开始生成动画，总帧数:', totalFrames);
        
        // 生成每一帧
        for (let i = 0; i < totalFrames; i++) {
            try {
                console.log(`正在捕获第 ${i + 1}/${totalFrames} 帧`);
                const progress = i / (totalFrames - 1);
                
                // 获取当前点
                const totalPoints = routePoints.length;
                if (totalPoints < 2) {
                    throw new Error('路线点数量不足');
                }
                
                const totalSegments = totalPoints - 1;
                const currentSegment = Math.min(Math.floor(progress * totalSegments), totalSegments - 1);
                const segmentProgress = Math.min((progress * totalSegments) % 1, 1);
                
                const startPoint = routePoints[currentSegment];
                const endPoint = routePoints[currentSegment + 1];
                
                if (!startPoint || !endPoint) {
                    throw new Error('路线点数据无效');
                }
                
                const lat = startPoint.lat + (endPoint.lat - startPoint.lat) * segmentProgress;
                const lon = startPoint.lon + (endPoint.lon - startPoint.lon) * segmentProgress;
                
                const currentPoint = L.latLng(lat, lon);
                
                // 更新地图视图
                map.setView(currentPoint, map.getZoom());
                
                // 等待地图更新
                await new Promise(resolve => setTimeout(resolve, 100));
                
                // 捕获当前帧
                console.log('开始捕获地图帧');
                const frame = await captureMapFrame();
                if (frame) {
                    animationFrames.push(frame);
                    console.log(`成功捕获第 ${i + 1} 帧`);
                } else {
                    throw new Error('帧捕获失败');
                }
            } catch (error) {
                console.error(`处理第 ${i + 1} 帧时出错:`, error.message || error);
                // 继续处理下一帧，而不是中断整个过程
                continue;
            }
        }
        
        if (animationFrames.length === 0) {
            throw new Error('没有成功捕获任何帧');
        }
        
        console.log(`成功捕获 ${animationFrames.length} 帧，开始生成GIF`);
        
        // 生成GIF
        const gif = new GIF({
            workers: 1,
            quality: 10,
            width: animationCanvas.width,
            height: animationCanvas.height,
            workerScript: 'js/lib/gif.worker.js',
            repeat: 0,
            background: '#ffffff',
            transparent: null,
            dither: false,
            debug: true
        });
        
        // 设置事件回调
        gif.onProgress = (progress) => {
            console.log(`GIF生成进度: ${Math.round(progress * 100)}%`);
            // 更新按钮状态
            saveButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> 生成中 ${Math.round(progress * 100)}%`;
        };
        
        gif.onFinished = (blob) => {
            console.log('GIF生成完成，大小:', blob.size, '字节');
            try {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'route-animation.gif';
                a.click();
                URL.revokeObjectURL(url);
                console.log('GIF文件已下载');
            } catch (error) {
                console.error('保存GIF文件时出错:', error);
                throw error;
            } finally {
                isCapturing = false;
                saveButton.disabled = false;
                saveButton.innerHTML = '<i class="fas fa-save"></i> 保存动画';
            }
        };
        
        gif.onError = (error) => {
            console.error('GIF生成失败:', error);
            throw error;
        };
        
        // 添加帧到GIF
        console.log('开始添加帧到GIF...');
        let frameCount = 0;
        
        // 使用 Promise 来处理帧添加
        const addFrames = async () => {
            for (let i = 0; i < animationFrames.length; i++) {
                try {
                    const frame = animationFrames[i];
                    console.log(`添加第 ${i + 1} 帧到GIF，尺寸: ${frame.width}x${frame.height}`);
                    
                    // 确保帧数据有效
                    if (!frame || !frame.width || !frame.height) {
                        console.error(`第 ${i + 1} 帧数据无效`);
                        continue;
                    }
                    
                    // 添加帧
                    gif.addFrame(frame, { delay: frameInterval });
                    console.log(`第 ${i + 1} 帧添加成功`);
                    frameCount++;
                    
                    // 每添加5帧暂停一下，避免阻塞
                    if (frameCount % 5 === 0) {
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                } catch (error) {
                    console.error(`添加第 ${i + 1} 帧时出错:`, error);
                }
            }
            
            console.log('所有帧添加完成，开始渲染GIF...');
            try {
                gif.render();
                console.log('GIF渲染已启动');
            } catch (error) {
                console.error('GIF渲染失败:', error);
                throw error;
            }
        };
        
        // 执行帧添加
        await addFrames();
    } catch (error) {
        console.error('生成动画失败:', error);
        alert('生成动画失败，请重试。错误信息：' + error.message);
        isCapturing = false;
        saveButton.disabled = false;
        saveButton.innerHTML = '<i class="fas fa-save"></i> 保存动画';
    }
});

// 捕获当前帧
async function captureMapFrame() {
    return new Promise((resolve, reject) => {
        try {
            console.log('开始捕获地图帧');
            
            // 创建一个超时Promise
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('帧捕获超时')), 10000);
            });
            
            // 创建捕获Promise
            const capturePromise = new Promise((resolve, reject) => {
                try {
                    // 获取地图容器和边界
                    const mapContainer = map.getContainer();
                    const bounds = map.getBounds();
                    
                    // 创建临时画布
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = mapContainer.offsetWidth;
                    canvas.height = mapContainer.offsetHeight;
                    
                    // 绘制地图背景
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    
                    // 绘制路线
                    if (routeLine) {
                        const latlngs = routeLine.getLatLngs();
                        ctx.beginPath();
                        latlngs.forEach((point, index) => {
                            const latLng = map.latLngToContainerPoint(point);
                            if (index === 0) {
                                ctx.moveTo(latLng.x, latLng.y);
                            } else {
                                ctx.lineTo(latLng.x, latLng.y);
                            }
                        });
                        ctx.strokeStyle = '#007bff';
                        ctx.lineWidth = 3;
                        ctx.stroke();
                    }
                    
                    // 绘制标记点
                    routeMarkers.forEach(marker => {
                        try {
                            const latLng = map.latLngToContainerPoint(marker.getLatLng());
                            const transport = marker.options.icon.options.html.match(/fa-(\w+)/)[1];
                            const color = transportColors[transport];
                            
                            // 绘制图标背景
                            ctx.beginPath();
                            ctx.arc(latLng.x, latLng.y, 15, 0, Math.PI * 2);
                            ctx.fillStyle = '#ffffff';
                            ctx.fill();
                            ctx.strokeStyle = color;
                            ctx.lineWidth = 2;
                            ctx.stroke();
                            
                            // 绘制图标
                            ctx.font = '20px FontAwesome';
                            ctx.fillStyle = color;
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillText('\uf183', latLng.x, latLng.y);
                        } catch (error) {
                            console.warn('绘制标记点时出错:', error);
                        }
                    });
                    
                    resolve(canvas);
                } catch (error) {
                    reject(error);
                }
            });
            
            // 使用Promise.race来处理超时
            Promise.race([capturePromise, timeoutPromise])
                .then(canvas => {
                    if (canvas) {
                        resolve(canvas);
                    } else {
                        reject(new Error('无法创建画布'));
                    }
                })
                .catch(error => {
                    console.error('捕获帧时发生错误:', error);
                    reject(error);
                });
        } catch (error) {
            console.error('捕获帧时发生错误:', error);
            reject(error);
        }
    });
}

// 更新路线显示
function updateRoute() {
    // 清除现有路线和标记
    if (routeLine) {
        map.removeLayer(routeLine);
    }
    routeMarkers.forEach(marker => map.removeLayer(marker));
    routeMarkers = [];
    if (animationMarker) {
        map.removeLayer(animationMarker);
    }

    if (routePoints.length > 0) {
        // 创建路线
        const latlngs = routePoints.map(point => [point.lat, point.lon]);
        routeLine = L.polyline(latlngs, { color: '#007bff', weight: 3 }).addTo(map);

        // 添加标记点
        routePoints.forEach((point, index) => {
            const marker = L.marker([point.lat, point.lon], {
                icon: L.divIcon({
                    className: 'custom-marker',
                    html: `<i class="fas ${transportIcons[point.transport || 'walking']}" style="color: ${transportColors[point.transport || 'walking']}; font-size: 24px;"></i>`,
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                })
            })
            .bindPopup(`${index + 1}. ${point.name}<br>出行方式: ${getTransportName(point.transport)}`)
            .addTo(map);
            routeMarkers.push(marker);
        });

        // 调整地图视图以显示整个路线
        map.fitBounds(routeLine.getBounds());
    }

    // 更新路线列表
    updateRouteList();
}

// 获取出行方式的中文名称
function getTransportName(type) {
    const transportNames = {
        walking: '步行',
        bicycle: '自行车',
        swimming: '游泳',
        motorcycle: '摩托',
        truck: '货车',
        bus: '公交',
        train: '火车',
        'high-speed-train': '高铁',
        plane: '飞机',
        ship: '轮船',
        car: '汽车',
        subway: '地铁'
    };
    return transportNames[type] || '步行';
}

// 更新路线列表显示
function updateRouteList() {
    const routeList = document.getElementById('route-list');
    routeList.innerHTML = '';

    routePoints.forEach((point, index) => {
        const item = document.createElement('div');
        item.className = 'route-item';
        item.draggable = true;
        item.innerHTML = `
            <span class="drag-handle">⋮</span>
            <span class="location-name">${index + 1}. ${point.name}</span>
            <div class="transport-selector">
                <span class="transport-icon" title="点击修改出行方式">
                    <i class="fas ${transportIcons[point.transport || 'walking']}" style="color: ${transportColors[point.transport || 'walking']};"></i>
                </span>
                <div class="transport-dropdown">
                    ${Object.entries(transportIcons).map(([type, icon]) => `
                        <div class="transport-option" data-type="${type}">
                            <i class="fas ${icon}" style="color: ${transportColors[type]};"></i>
                            <span>${getTransportName(type)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            <span class="remove-btn">×</span>
        `;

        // 添加拖拽事件
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', index);
        });

        item.addEventListener('dragover', (e) => {
            e.preventDefault();
            const draggingItem = document.querySelector('.dragging');
            if (draggingItem) {
                draggingItem.classList.remove('dragging');
            }
            item.classList.add('dragging');
        });

        item.addEventListener('drop', (e) => {
            e.preventDefault();
            const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
            const toIndex = index;
            if (fromIndex !== toIndex) {
                const point = routePoints[fromIndex];
                routePoints.splice(fromIndex, 1);
                routePoints.splice(toIndex, 0, point);
                updateRoute();
            }
        });

        // 添加删除事件
        item.querySelector('.remove-btn').addEventListener('click', () => {
            routePoints.splice(index, 1);
            updateRoute();
        });

        // 添加出行方式选择事件
        const transportSelector = item.querySelector('.transport-selector');
        const transportIcon = item.querySelector('.transport-icon');
        const transportDropdown = item.querySelector('.transport-dropdown');

        transportIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            // 关闭其他打开的下拉菜单
            document.querySelectorAll('.transport-dropdown').forEach(dropdown => {
                if (dropdown !== transportDropdown) {
                    dropdown.classList.remove('show');
                }
            });
            transportDropdown.classList.toggle('show');
        });

        // 点击下拉菜单选项
        transportDropdown.querySelectorAll('.transport-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const newType = option.dataset.type;
                routePoints[index].transport = newType;
                updateRoute();
                transportDropdown.classList.remove('show');
            });
        });

        // 点击其他地方关闭下拉菜单
        document.addEventListener('click', () => {
            transportDropdown.classList.remove('show');
        });

        routeList.appendChild(item);
    });
}

// 清除路线
document.getElementById('clear-route').addEventListener('click', () => {
    routePoints = [];
    updateRoute();
});

// 优化路线（使用简单的最近邻算法）
document.getElementById('optimize-route').addEventListener('click', () => {
    if (routePoints.length <= 2) return;

    const optimizedPoints = [];
    const remainingPoints = [...routePoints];
    let currentPoint = remainingPoints.shift();
    optimizedPoints.push(currentPoint);

    while (remainingPoints.length > 0) {
        let nearestIndex = 0;
        let minDistance = Infinity;

        // 找到最近的点
        remainingPoints.forEach((point, index) => {
            const distance = currentPoint.lat * point.lat + currentPoint.lon * point.lon;
            if (distance < minDistance) {
                minDistance = distance;
                nearestIndex = index;
            }
        });

        currentPoint = remainingPoints.splice(nearestIndex, 1)[0];
        optimizedPoints.push(currentPoint);
    }

    routePoints = optimizedPoints;
    updateRoute();
});

// 添加出行方式选择事件监听
document.querySelectorAll('.transport-option').forEach(option => {
    option.addEventListener('click', () => {
        // 移除其他选项的active类
        document.querySelectorAll('.transport-option').forEach(opt => {
            opt.classList.remove('active');
        });
        // 添加当前选项的active类
        option.classList.add('active');
        // 更新选中的出行方式
        selectedTransport = option.dataset.type;
    });
});

// 设置默认选中的出行方式
document.querySelector('.transport-option[data-type="walking"]').classList.add('active');

// 拦截瓦片请求
map.on('tileload', function(e) {
    const tile = e.tile;
    const url = tile.src;
    
    // 将瓦片数据保存到缓存
    fetch(url, {
        headers: headers,
        mode: 'cors',
        credentials: 'omit'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob();
    })
    .then(blob => {
        cache.set(url, blob);
    })
    .catch(error => {
        console.warn('缓存瓦片失败:', error);
    });
});

// 添加离线模式切换按钮
const offlineButton = L.control({ position: 'topright' });
offlineButton.onAdd = function(map) {
    const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
    const button = L.DomUtil.create('a', '', div);
    button.innerHTML = '离线模式';
    button.href = '#';
    
    L.DomEvent.on(button, 'click', function(e) {
        e.preventDefault();
        toggleOfflineMode();
    });
    
    return div;
};
offlineButton.addTo(map);

let isOffline = false;
let currentMarker = null;

function toggleOfflineMode() {
    isOffline = !isOffline;
    if (isOffline) {
        // 切换到离线模式
        map.eachLayer((layer) => {
            if (layer instanceof L.TileLayer) {
                layer.setUrl('data:image/png;base64,');
            }
        });
    } else {
        // 切换回在线模式
        map.eachLayer((layer) => {
            if (layer instanceof L.TileLayer) {
                layer.setUrl('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
            }
        });
    }
}

// 搜索功能
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

async function searchLocation(query) {
    try {
        // 使用 Nominatim API 进行地理编码
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`, {
            headers: {
                'User-Agent': 'OfflineMapApp/1.0',
                'Accept': 'application/json',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.length > 0) {
            const location = data[0];
            const lat = parseFloat(location.lat);
            const lon = parseFloat(location.lon);
            
            // 移除之前的标记
            if (currentMarker) {
                map.removeLayer(currentMarker);
            }
            
            // 添加新标记
            currentMarker = L.marker([lat, lon]).addTo(map);
            currentMarker.bindPopup(location.display_name).openPopup();
            
            // 将地图中心移动到搜索结果
            map.setView([lat, lon], 15);
            
            // 添加到路线
            routePoints.push({
                lat: lat,
                lon: lon,
                name: location.display_name,
                transport: selectedTransport
            });
            updateRoute();
            
            // 缓存该区域的地图瓦片
            const bounds = map.getBounds();
            const zoom = map.getZoom();
            
            // 使用 Promise.all 和延迟来避免请求限制
            const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
            const promises = [];
            
            for (let x = Math.floor(bounds.getWest() / 256); x <= Math.ceil(bounds.getEast() / 256); x++) {
                for (let y = Math.floor(bounds.getSouth() / 256); y <= Math.ceil(bounds.getNorth() / 256); y++) {
                    const url = `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`;
                    if (!cache.has(url)) {
                        promises.push(
                            delay(100).then(() => 
                                fetch(url, {
                                    headers: headers,
                                    mode: 'cors',
                                    credentials: 'omit'
                                })
                                .then(response => {
                                    if (!response.ok) {
                                        throw new Error(`HTTP error! status: ${response.status}`);
                                    }
                                    return response.blob();
                                })
                                .then(blob => cache.set(url, blob))
                                .catch(error => {
                                    console.warn('缓存瓦片失败:', error);
                                })
                            )
                        );
                    }
                }
            }
            
            // 等待所有瓦片加载完成
            await Promise.all(promises);
        } else {
            alert('未找到该地点，请尝试其他搜索词');
        }
    } catch (error) {
        console.error('搜索失败:', error);
        alert('搜索失败，请稍后重试');
    }
}

// 添加搜索事件监听器
searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        searchLocation(query);
    }
});

// 添加回车键搜索支持
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
            searchLocation(query);
        }
    }
});

// 添加右键点击和双击事件处理
let lastClickTime = 0;
let clickTimeout;

map.on('contextmenu', function(e) {
    addPointAtLocation(e.latlng);
});

map.on('click', function(e) {
    const currentTime = new Date().getTime();
    if (currentTime - lastClickTime < 300) { // 300ms内的双击
        addPointAtLocation(e.latlng);
    }
    lastClickTime = currentTime;
});

// 在地图上添加点
async function addPointAtLocation(latlng) {
    try {
        // 使用反向地理编码获取地点名称
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}&zoom=18&addressdetails=1`,
            {
                headers: {
                    'User-Agent': 'OfflineMapApp/1.0',
                    'Accept': 'application/json',
                    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const locationName = data.display_name || `位置 ${routePoints.length + 1}`;

        // 添加到路线
        routePoints.push({
            lat: latlng.lat,
            lon: latlng.lng,
            name: locationName,
            transport: selectedTransport
        });

        updateRoute();
    } catch (error) {
        console.error('获取地点信息失败:', error);
        // 如果获取地点信息失败，使用默认名称
        routePoints.push({
            lat: latlng.lat,
            lon: latlng.lng,
            name: `位置 ${routePoints.length + 1}`,
            transport: selectedTransport
        });
        updateRoute();
    }
}

// 生成轨迹动画
function generateAnimation() {
    if (!routeLine || !routePoints || routePoints.length < 2) {
        alert('请先规划路线');
        return;
    }

    // 创建临时画布
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = mapContainer.offsetWidth;
    canvas.height = mapContainer.offsetHeight;

    // 创建 GIF 编码器
    const gif = new GIF({
        workers: 1,
        quality: 10,
        width: canvas.width,
        height: canvas.height,
        workerScript: 'js/lib/gif.worker.js',
        repeat: 0,
        background: '#ffffff',
        transparent: null
    });

    // 设置进度回调
    gif.onProgress = function(progress) {
        console.log('GIF 生成进度:', progress);
    };

    // 设置完成回调
    gif.onFinished = function(blob) {
        // 创建下载链接
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'route_animation.gif';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log('GIF 生成完成');
    };

    // 设置错误回调
    gif.onError = function(error) {
        console.error('GIF 生成错误:', error);
        alert('生成动画失败，请重试。错误信息：' + error);
    };

    // 计算总帧数
    const totalFrames = 30;
    const fps = 15;
    const frameDelay = 1000 / fps;

    console.log('开始生成动画，总帧数:', totalFrames);

    // 生成每一帧
    for (let i = 0; i < totalFrames; i++) {
        const progress = i / totalFrames;
        const currentPoint = getCurrentPoint(progress);
        
        // 更新地图视图
        map.setView(currentPoint, map.getZoom());
        
        // 等待地图更新
        setTimeout(() => {
            // 清除画布
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // 绘制地图背景
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // 绘制路线
            ctx.strokeStyle = '#3388ff';
            ctx.lineWidth = 3;
            ctx.beginPath();
            
            // 绘制已完成部分
            const completedPoints = routePoints.slice(0, Math.floor(routePoints.length * progress));
            for (let j = 0; j < completedPoints.length - 1; j++) {
                const start = map.latLngToContainerPoint(completedPoints[j]);
                const end = map.latLngToContainerPoint(completedPoints[j + 1]);
                ctx.moveTo(start.x, start.y);
                ctx.lineTo(end.x, end.y);
            }
            ctx.stroke();
            
            // 绘制当前位置标记
            const markerPos = map.latLngToContainerPoint(currentPoint);
            ctx.fillStyle = '#ff0000';
            ctx.beginPath();
            ctx.arc(markerPos.x, markerPos.y, 5, 0, Math.PI * 2);
            ctx.fill();
            
            // 添加帧到 GIF
            gif.addFrame(canvas, { delay: frameDelay });
            
            // 如果是最后一帧，开始渲染
            if (i === totalFrames - 1) {
                gif.render();
            }
        }, 100);
    }
} 