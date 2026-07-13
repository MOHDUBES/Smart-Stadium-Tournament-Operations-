import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { useMap, Polyline, Marker, Popup } from 'react-leaflet';

// Fix Default Icon issue in Leaflet for React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapRouterProps {
  fromPoint: [number, number] | null;
  toPoint: [number, number] | null;
  routingType: 'road' | 'internal' | null;
}

export const MapRouter: React.FC<MapRouterProps> = ({ fromPoint, toPoint, routingType }) => {
  const map = useMap();

  useEffect(() => {
    if (!fromPoint || !toPoint || routingType !== 'road') return;

    // Road routing using OSRM
    const routingControl = L.Routing.control({
      waypoints: [L.latLng(fromPoint[0], fromPoint[1]), L.latLng(toPoint[0], toPoint[1])],
      routeWhileDragging: false,
      showAlternatives: false,
      fitSelectedRoutes: true,
      lineOptions: {
        styles: [{ color: '#2FBF9F', weight: 5, opacity: 0.9 }],
        extendToWaypoints: true,
        missingRouteTolerance: 0,
      },
      show: false, // Hide ugly default turn-by-turn instructions box
      createMarker: (i, waypoint) => {
        return L.marker(waypoint.latLng, {
          icon: DefaultIcon,
        }).bindPopup(i === 0 ? 'Start' : 'Destination');
      },
    }).addTo(map);

    return () => {
      try {
        if (map && routingControl) {
          map.removeControl(routingControl);
        }
      } catch (e) {
        // Ignore Leaflet unmount errors
      }
    };
  }, [map, fromPoint, toPoint, routingType]);

  // Internal Stadium Routing (Straight Path / Polyline)
  if (routingType === 'internal' && fromPoint && toPoint) {
    // Generate a slightly curved or simple multi-point path for interior walking
    const midPoint: [number, number] = [
      (fromPoint[0] + toPoint[0]) / 2,
      fromPoint[1], // slight bend
    ];

    const path = [fromPoint, midPoint, toPoint];

    return (
      <>
        <Marker position={fromPoint} icon={DefaultIcon}>
          <Popup>Start (Inside Stadium)</Popup>
        </Marker>
        <Marker position={toPoint} icon={DefaultIcon}>
          <Popup>Destination (Seat)</Popup>
        </Marker>
        <Polyline positions={path} color="#F59E0B" weight={5} dashArray="10, 10" />
      </>
    );
  }

  return null;
};
