import { useState } from 'react';
import { EarthContainer } from './components/Earth';
import { MarkerForm } from './components/MarkerForm';
import './components/styles.css';
import * as THREE from 'three';

interface Marker {
  id: string;
  position: THREE.Vector3;
  timestamp: Date;
  transport: string;
  location: string;
}

function App() {
  const [markers, setMarkers] = useState<Marker[]>([]);

  const handleAddMarker = (marker: Omit<Marker, 'location'> & { location?: string }) => {
    const newMarker = {
      ...marker,
      location: marker.location || '未知位置'
    };
    setMarkers([...markers, newMarker as Marker]);
  };

  return (
    <div className="app-container">
      <div className="form-container">
        <MarkerForm onAddMarker={handleAddMarker} />
        
        {markers.length > 0 && (
          <div className="track-info">
            <h3>轨迹信息</h3>
            {markers.map((marker) => (
              <div key={marker.id} className="track-item">
                <span className="transport">{marker.transport}</span>
                <span className="time">{marker.timestamp.toLocaleString()}</span>
                <span className="location">{marker.location}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="earth-container">
        <EarthContainer />
      </div>
    </div>
  );
}

export default App;
