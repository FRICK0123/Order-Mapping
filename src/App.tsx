import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';

const smallIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [16, 24],
  iconAnchor: [8, 24],
  popupAnchor: [1, -20]
});

type RawOrder = {
  date: string;
  confirmation_code: string;
  merchant_name: string;
  firstname: string;
  user_code: string;
  coords: string;
};

type Order = RawOrder & { id: number };

type LocationGroup = {
  lat: string;
  lng: string;
  orders: Order[];
};

export default function App() {
  const [locations, setLocations] = useState<LocationGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const worker = new Worker(new URL('/workers/groupWorker.ts', import.meta.url), {
      type: 'module',
    });

    fetch('/data/order_maps.json')
      .then(res => res.json())
      .then((data: RawOrder[]) => {
        worker.postMessage(data);
      })
      .catch(console.error);

    worker.onmessage = (event) => {
      const groupedLocations: LocationGroup[] = event.data;
      setLocations(groupedLocations);
      setLoading(false); // Loading done
      worker.terminate();
    };

    return () => {
      worker.terminate();
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-gray-600">Loading map data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen">
      <MapContainer center={[9.317988, 123.290297]} zoom={15} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MarkerClusterGroup chunkedLoading>
          {locations.map((loc, idx) => (
            <Marker key={idx} position={[parseFloat(loc.lat), parseFloat(loc.lng)]} icon={smallIcon}>
              <Popup>
                <div style={{ maxHeight: '200px', overflowY: 'auto', maxWidth: '250px' }}>
                  {loc.orders.map((order) => (
                    <div key={order.id} className="mb-2 border-b pb-2">
                      <p><strong>Code:</strong> {order.confirmation_code}</p>
                      <p><strong>Name:</strong> {order.firstname}</p>
                      <p><strong>Merchant:</strong> {order.merchant_name}</p>
                      <p><strong>Date:</strong> {order.date}</p>
                    </div>
                  ))}
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}
