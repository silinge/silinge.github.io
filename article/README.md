# 离线3D地图网页应用

## 说明

- 使用CesiumJS作为3D地图引擎。
- 地图瓦片数据采用OpenStreetMap导出，放置于`tiles/`目录下，结构为`tiles/{z}/{x}/{y}.png`。
- 无需外部API，完全离线运行。

## 使用方法

1. 下载CesiumJS（或用CDN）。
2. 使用如[TileMill](https://tilemill-project.github.io/tilemill/)或[osm2vectortiles](https://osm2vectortiles.org/)等工具导出所需区域的瓦片，放入`tiles/`目录。
3. 启动本地HTTP服务器（如`python -m http.server`），务必通过 http://localhost:端口/ 访问`offline-3d-map.html`，否则浏览器安全策略（CORS）会阻止瓦片加载，直接双击HTML文件无法正常显示地图。

## 参考

- [CesiumJS 官网](https://cesium.com/platform/cesiumjs/)
- [OpenStreetMap 数据下载](https://www.openstreetmap.org/export)
