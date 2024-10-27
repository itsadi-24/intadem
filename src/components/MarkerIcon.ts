import L from 'leaflet';

const MarkerIcon = L.icon({
  iconUrl: '../../public/marker.png',
  //   iconRetinaUrl: '../../public/marker.png',
  //   shadowUrl: '../../public/marker.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

export default MarkerIcon;
