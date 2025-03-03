import { useState } from 'react';
import * as THREE from 'three';

interface MarkerFormProps {
  onAddMarker: (marker: {
    id: string;
    position: THREE.Vector3;
    timestamp: Date;
    transport: string;
  }) => void;
}

interface GeocodingResult {
  lat: number;
  lng: number;
}

// 简单的地理编码函数，将地点名称转换为经纬度坐标
const geocodeLocation = async (location: string): Promise<GeocodingResult | null> => {
  // 在实际应用中，这里应该调用真实的地理编码API
  // 由于我们没有实际的API密钥，这里使用一些预设的地点作为示例
  const presetLocations: Record<string, GeocodingResult> = {
    '北京': { lat: 39.9042, lng: 116.4074 },
    '上海': { lat: 31.2304, lng: 121.4737 },
    '广州': { lat: 23.1291, lng: 113.2644 },
    '深圳': { lat: 22.5431, lng: 114.0579 },
    '香港': { lat: 22.3193, lng: 114.1694 },
    '东京': { lat: 35.6762, lng: 139.6503 },
    '纽约': { lat: 40.7128, lng: -74.0060 },
    '伦敦': { lat: 51.5074, lng: -0.1278 },
    '巴黎': { lat: 48.8566, lng: 2.3522 },
    '悉尼': { lat: -33.8688, lng: 151.2093 },
  };

  // 检查是否是预设地点
  if (location in presetLocations) {
    return presetLocations[location];
  }

  // 检查是否是经纬度格式 (例如: "39.9042, 116.4074")
  const coordsMatch = location.match(/^\s*([-+]?\d+(\.\d+)?)\s*,\s*([-+]?\d+(\.\d+)?)\s*$/);
  if (coordsMatch) {
    const lat = parseFloat(coordsMatch[1]);
    const lng = parseFloat(coordsMatch[3]);
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return { lat, lng };
    }
  }

  // 如果不是预设地点或有效的经纬度，返回null
  return null;
};

// 将经纬度转换为Three.js中的3D坐标
const latLngToVector3 = (lat: number, lng: number, radius: number = 1): THREE.Vector3 => {
  // 将经纬度转换为弧度
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  // 球面坐标转换为笛卡尔坐标
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
};

export function MarkerForm({ onAddMarker }: MarkerFormProps) {
  const [location, setLocation] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [transport, setTransport] = useState('飞机');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!location || !timestamp) {
      setError('请填写所有必填字段');
      return;
    }

    try {
      const geocodeResult = await geocodeLocation(location);
      
      if (!geocodeResult) {
        setError('无法找到该地点，请输入有效的地点名称或经纬度坐标');
        return;
      }

      const { lat, lng } = geocodeResult;
      const position = latLngToVector3(lat, lng);
      
      onAddMarker({
        id: Date.now().toString(),
        position,
        timestamp: new Date(timestamp),
        transport
      });

      // 清空表单
      setLocation('');
      setTimestamp('');
    } catch (err) {
      setError('添加标记时出错');
      console.error(err);
    }
  };

  return (
    <div className="marker-form">
      <h2>添加轨迹点</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="location">地点或经纬度:</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="城市名称或经纬度 (例如: 北京 或 39.9042, 116.4074)"
          />
        </div>
        <div className="form-group">
          <label htmlFor="timestamp">时间:</label>
          <input
            type="datetime-local"
            id="timestamp"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="transport">交通工具:</label>
          <select
            id="transport"
            value={transport}
            onChange={(e) => setTransport(e.target.value)}
          >
            <option value="飞机">飞机</option>
            <option value="火车">火车</option>
            <option value="汽车">汽车</option>
            <option value="轮船">轮船</option>
            <option value="步行">步行</option>
          </select>
        </div>
        <button type="submit">添加标记</button>
      </form>
    </div>
  );
}