'use client';

import { useEffect, useRef, useState } from 'react';
import type { Map as LeafletMap } from 'leaflet';
import { ExternalLink, MapPinned, Plane, TrainFront } from 'lucide-react';

const routeStops = [
  {
    name: 'London',
    station: 'Paddington / 市中心',
    date: '09/29–10/02 · 3晚',
    coordinates: [51.5074, -0.1278] as [number, number],
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Westminster+London',
  },
  {
    name: 'Oxford',
    station: 'Oxford Station',
    date: '10/02 · 日间停留',
    coordinates: [51.752, -1.2577] as [number, number],
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Oxford+Station+UK',
  },
  {
    name: 'Bath',
    station: 'Bath Spa',
    date: '10/02–10/03 · 1晚',
    coordinates: [51.3811, -2.359] as [number, number],
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Bath+Spa+Station+UK',
  },
  {
    name: 'York',
    station: 'York Station',
    date: '10/03–10/04 · 1晚',
    coordinates: [53.959, -1.0815] as [number, number],
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=York+Station+UK',
  },
  {
    name: 'Edinburgh',
    station: 'Waverley Station',
    date: '10/04–10/07 · 3晚',
    coordinates: [55.9533, -3.1883] as [number, number],
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Edinburgh+Waverley+Station',
  },
];

const airports = [
  { name: 'LHR', label: '09/29 入境', coordinates: [51.47, -0.4543] as [number, number] },
  { name: 'EDI', label: '10/07 离境', coordinates: [55.95, -3.3725] as [number, number] },
];

export function RouteMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    let disposed = false;

    void import('leaflet')
      .then((leaflet) => {
        if (disposed || !containerRef.current || mapRef.current) return;

        const map = leaflet.map(containerRef.current, {
          scrollWheelZoom: false,
          zoomControl: true,
        });
        mapRef.current = map;

        leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 18,
        }).addTo(map);

        routeStops.forEach((stop, index) => {
          const icon = leaflet.divIcon({
            className: 'route-pin',
            html: `<span>${index + 1}</span>`,
            iconSize: [36, 36],
            iconAnchor: [18, 18],
          });
          leaflet.marker(stop.coordinates, { icon, title: stop.name })
            .bindPopup(`<strong>${stop.name}</strong><br>${stop.date}<br>${stop.station}`)
            .addTo(map);
        });

        airports.forEach((airport) => {
          const icon = leaflet.divIcon({
            className: 'airport-pin',
            html: `<span>${airport.name}</span>`,
            iconSize: [48, 28],
            iconAnchor: [24, 14],
          });
          leaflet.marker(airport.coordinates, { icon, title: `${airport.name} ${airport.label}` })
            .bindPopup(`<strong>${airport.name}</strong><br>${airport.label}`)
            .addTo(map);
        });

        const route = routeStops.map((stop) => stop.coordinates);
        leaflet.polyline(route, {
          color: '#e84632',
          dashArray: '8 7',
          opacity: 0.88,
          weight: 4,
        }).addTo(map);
        map.fitBounds(leaflet.latLngBounds(route), { padding: [38, 38] });
      })
      .catch(() => {
        if (!disposed) setMapError(true);
      });

    return () => {
      disposed = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="map-layout">
      <div className="map-frame">
        {mapError ? (
          <div className="map-fallback"><MapPinned /><strong>地图暂时无法载入</strong><span>右侧仍可逐站打开 Google Maps。</span></div>
        ) : null}
        <div ref={containerRef} className="route-map" aria-label="英国五城行程地图，可缩放并点击城市编号查看信息" />
        <div className="map-legend"><span><TrainFront /> 铁路方向</span><span><Plane /> 机场</span></div>
      </div>

      <ol className="map-stop-list" aria-label="路线城市顺序">
        {routeStops.map((stop, index) => (
          <li key={stop.name}>
            <span className="stop-number">{index + 1}</span>
            <div><strong>{stop.name}</strong><span>{stop.date}</span><small>{stop.station}</small></div>
            <a href={stop.mapUrl} target="_blank" rel="noreferrer" aria-label={`在 Google Maps 查看 ${stop.name}`}><ExternalLink /></a>
          </li>
        ))}
      </ol>
    </div>
  );
}
