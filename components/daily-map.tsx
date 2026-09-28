'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Map as LeafletMap, Marker } from 'leaflet';
import { ArrowUpRight, CalendarDays, Expand, MapPin, Navigation } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { days } from '@/lib/itinerary';
import { dayMapLabels, pointKinds, pointsForDate, pointMapUrl, type DailyMapPoint } from '@/lib/daily-map';
import { dailyMapPoints } from '@/lib/daily-map-points';
import './daily-map.css';

function PointMap({ points, selectedId, onSelect, fitVersion }: {
  points: DailyMapPoint[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  fitVersion: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef(new Map<string, Marker>());
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [tileFailed, setTileFailed] = useState(false);

  useEffect(() => {
    let disposed = false;
    let observer: ResizeObserver | undefined;
    let instance: LeafletMap | undefined;
    const markers = markersRef.current;
    void import('leaflet').then(L => {
      if (disposed || !containerRef.current) return;
      const map = L.map(containerRef.current, { scrollWheelZoom: false, zoomControl: true });
      instance = map;
      mapRef.current = map;
      L.control.scale({ imperial: false, position: 'topright' }).addTo(map);
      const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', maxZoom: 18,
      }).addTo(map);
      tileLayer.on('tileerror', () => { if (!disposed) setTileFailed(true); });
      tileLayer.on('tileload', () => { if (!disposed) setTileFailed(false); });
      points.forEach((point, index) => {
        const icon = L.divIcon({
          className: 'daily-map-marker',
          html: `<span style="background:${pointKinds[point.kind].color}">${index + 1}</span>`,
          iconSize: [34, 34], iconAnchor: [17, 17],
        });
        const marker = L.marker([point.lat, point.lng], { icon, title: `${index + 1}. ${point.name}`, riseOnHover: true }).addTo(map);
        const tooltip = document.createElement('span');
        tooltip.textContent = `${index + 1}. ${point.name}`;
        marker.bindTooltip(tooltip, { direction: 'top', offset: [0, -16] });
        marker.on('click', () => onSelect(point.id));
        markers.set(point.id, marker);
      });
      if (points.length) map.fitBounds(points.map(point => [point.lat, point.lng] as [number, number]), { padding: [35, 35], maxZoom: 15 });
      observer = new ResizeObserver(() => map.invalidateSize());
      observer.observe(containerRef.current);
      setLoaded(true);
    }).catch(() => { if (!disposed) setFailed(true); });
    return () => {
      disposed = true;
      observer?.disconnect();
      markers.clear();
      instance?.remove();
      mapRef.current = null;
    };
  }, [points, onSelect]);

  useEffect(() => {
    if (!loaded) return;
    markersRef.current.forEach((value, id) => {
      value.getElement()?.classList.toggle('is-selected', id === selectedId);
      value.setZIndexOffset(id === selectedId ? 1000 : 0);
      if (id !== selectedId) value.closeTooltip();
    });
    const marker = selectedId ? markersRef.current.get(selectedId) : undefined;
    const map = mapRef.current;
    if (!marker || !map) return;
    map.setView(marker.getLatLng(), Math.max(map.getZoom(), 14), { animate: false });
    marker.openTooltip();
  }, [selectedId, loaded]);

  useEffect(() => {
    if (loaded && points.length) mapRef.current?.fitBounds(points.map(point => [point.lat, point.lng] as [number, number]), { padding: [35, 35], maxZoom: 15, animate: false });
  }, [fitVersion, points, loaded]);

  return <div className="daily-map-canvas-wrap">
    <section ref={containerRef} className="daily-map-canvas" aria-label="当天地点分布地图" />
    {!loaded && <output className="daily-map-status">{failed ? '地图暂时无法加载，可用地点列表打开 Google Maps。' : '正在载入地图…'}</output>}
    {loaded && tileFailed && <output className="daily-map-tile-notice">底图载入不完整，地点列表和导航仍可使用。</output>}
    <div className="daily-map-canvas-caption">编号对应下方或右侧地点 · 可拖动、缩放</div>
  </div>;
}

export function DailyMap() {
  const [date, setDate] = useState(days[0].date);
  const [includeConnections, setIncludeConnections] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [fitVersion, setFitVersion] = useState(0);
  const dateBarRef = useRef<HTMLDivElement>(null);
  const activeDay = days.find(day => day.date === date) ?? days[0];
  const dayPoints = useMemo(() => dailyMapPoints.filter(point => point.date === date), [date]);
  const points = useMemo(() => pointsForDate(dailyMapPoints, date, includeConnections), [date, includeConnections]);
  const selected = points.find(point => point.id === selectedId);
  const labels = dayMapLabels[date];
  const hasConnections = dayPoints.some(point => point.scope === 'connection');

  function changeDate(value: unknown) {
    if (typeof value !== 'string' || !dayMapLabels[value]) return;
    setDate(value);
    setSelectedId(null);
    setIncludeConnections(value === '10/04');
  }

  useEffect(() => {
    const bar = dateBarRef.current;
    const activeTab = bar?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (bar && activeTab) {
      bar.scrollLeft += activeTab.getBoundingClientRect().left - bar.getBoundingClientRect().left - (bar.clientWidth - activeTab.clientWidth) / 2;
    }
  }, [date]);

  useEffect(() => {
    const readDayLink = () => {
      if (!window.location.hash.startsWith('#daily-map?')) return;
      const value = new URLSearchParams(window.location.hash.split('?')[1] ?? '').get('day');
      if (value && dayMapLabels[value]) {
        changeDate(value);
        requestAnimationFrame(() => document.getElementById('daily-map')?.scrollIntoView({ block: 'start' }));
      }
    };
    readDayLink();
    window.addEventListener('hashchange', readDayLink);
    return () => window.removeEventListener('hashchange', readDayLink);
  }, []);

  return <section className="section daily-map-section" id="daily-map" aria-labelledby="daily-map-title">
    <div className="section-heading"><div><p className="eyebrow"><CalendarDays /> Day by day</p><h2 id="daily-map-title">每天去哪里</h2></div><a className="daily-map-overview-link" href="#map">看全程路线 <ArrowUpRight /></a></div>
    <p className="section-intro">选一天，看景点、吃饭和乘车的位置。点地图上的编号或地点名称，可放大查看。</p>
    <Tabs value={date} onValueChange={changeDate} className="daily-map-tabs">
      <div ref={dateBarRef} className="daily-map-tab-scroll"><TabsList className="daily-map-date-list" aria-label="选择旅行日期">
        {days.map(day => <TabsTrigger key={day.date} value={day.date} className="daily-map-date"><span>{day.date.replace(/^0/, '')}</span><strong>{dayMapLabels[day.date].label}</strong></TabsTrigger>)}
      </TabsList></div>
      <TabsContent value={date} className="daily-map-panel">
        <header className="daily-map-heading"><div><p>{date} · {activeDay.weekday} · {points.length} 个地点{!includeConnections && hasConnections ? ' · 当地游览' : ''}</p><h3>{labels.area}</h3></div><div className="daily-map-actions">
          {hasConnections && <div className="daily-map-scope" aria-label="当天地图范围"><button type="button" aria-pressed={!includeConnections} onClick={() => { setIncludeConnections(false); setSelectedId(null); }}>{date === '10/04' ? '抵达爱丁堡' : '当地游览'}</button><button type="button" aria-pressed={includeConnections} onClick={() => { setIncludeConnections(true); setSelectedId(null); }}>含全日交通</button></div>}
          <Button variant="outline" size="sm" onClick={() => { setSelectedId(null); setFitVersion(value => value + 1); }}><Expand />显示全部点</Button>
        </div></header>
        <div className="daily-map-layout">
          <PointMap key={`${date}-${includeConnections}`} points={points} selectedId={selectedId} onSelect={setSelectedId} fitVersion={fitVersion} />
          <aside className="daily-map-stop-panel" aria-label="当天地点列表"><ol className="daily-map-stop-list">
            {points.map((point, index) => <li key={point.id}><button type="button" aria-pressed={selectedId === point.id} onClick={() => setSelectedId(point.id)} className="daily-map-stop"><span className="daily-map-number" style={{ background: pointKinds[point.kind].color }}>{index + 1}</span><span><strong>{point.name}</strong><small>{point.englishName}</small></span><span className="daily-map-kind">{pointKinds[point.kind].label}</span></button></li>)}
          </ol></aside>
        </div>
        <div className="daily-map-footer"><div className="daily-map-key">{Object.entries(pointKinds).map(([kind, value]) => <span key={kind}><i style={{ background: value.color }} />{value.label}</span>)}</div><a href={`#day-${date.replace('/', '-')}`}>查看当天详细行程 <ArrowUpRight /></a></div>
        {selected && <div className="daily-map-detail" aria-live="polite"><MapPin /><div><strong>{selected.name} · {selected.englishName}</strong><p>{selected.note}</p></div><a href={pointMapUrl(selected)} target="_blank" rel="noreferrer"><Navigation />Google Maps</a></div>}
        <p className="daily-map-day-note">{labels.note}</p>
        <p className="daily-map-location-note">标记用于看位置分布，公共街区为参考点；实际入口、路线和公交方向以现场及导航为准。往返复用同一地点，地图不绘制实际交通路线。</p>
      </TabsContent>
    </Tabs>
  </section>;
}
