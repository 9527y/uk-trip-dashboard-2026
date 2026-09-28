'use client';

import { useEffect, useRef, useState } from 'react';
import type { Map as LeafletMap } from 'leaflet';
import { ArrowLeftRight, BusFront, ExternalLink, Footprints, MapPinned, Plane, TrainFront } from 'lucide-react';
import './route-map.css';
import { londonStay, edinburghStay } from '@/lib/stays';

type Coordinates = [number, number];
type MapView = 'full' | 'london' | 'coast';

const locations: Record<string, Coordinates> = {
  london: [51.50722, -0.1275],
  cambridge: [52.205, 0.1225],
  lewes: [50.87472, 0.01167],
  seaford: [50.77, 0.1],
  exceat: [50.77522, 0.15333],
  bridge: [50.77344, 0.14572],
  cottages: [50.75869, 0.14521],
  newcastle: [54.9738, -1.6131],
  carlisle: [54.89472, -2.93639],
  edinburgh: [55.95333, -3.18917],
  heathrow: [51.47, -0.4543],
  edi: [55.95, -3.3725],
};

const viewBounds: Record<MapView, [Coordinates, Coordinates]> = {
  full: [[50.64, -3.6], [56.08, 0.38]],
  london: [[50.64, -0.59], [52.32, 0.4]],
  coast: [[50.745, 0.073], [50.792, 0.178]],
};

const mainStops = [
  { id: 'london', label: '伦敦 London', symbol: '伦', color: '#e84632', detail: '09/29 入住 → 10/04 退房 · 5 晚 · 伦敦青旅 Barmy Badger Backpackers 已订<br>剑桥、白崖均当天往返，行李留在伦敦。' },
  { id: 'cambridge', label: '剑桥 Cambridge', symbol: '剑', color: '#39756c', detail: '10/01 当天往返<br>国王十字火车站 London King’s Cross ⇄ 剑桥火车站 Cambridge，晚上回伦敦。' },
  { id: 'seaford', label: '锡福德 Seaford · 白崖 Seven Sisters', symbol: '崖', color: '#a67512', detail: '10/03 白崖当天往返<br>伦敦 London → 刘易斯 Lewes 换乘 → 锡福德 Seaford<br>转公交 12 到埃克西特 Exceat 地区的七姐妹公园中心公交站 Seven Sisters Park Centre，再经桥到海岸警卫队小屋 Coastguard Cottages，原路返程。' },
  { id: 'edinburgh', label: '爱丁堡 Edinburgh', symbol: '爱', color: '#10243e', detail: '10/04 入住 → 10/07 退房 · 3 晚 · 城堡岩青旅 Castle Rock Hostel 已订<br>10/07 前往爱丁堡机场 Edinburgh Airport（EDI）返程。' },
];

const mapLink = (query: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

export function RouteMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const [mapError, setMapError] = useState(false);
  const [tileError, setTileError] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [view, setView] = useState<MapView>('full');

  useEffect(() => {
    let disposed = false;
    let resizeObserver: ResizeObserver | undefined;

    void import('leaflet')
      .then((leaflet) => {
        if (disposed || !containerRef.current || mapRef.current) return;

        const map = leaflet.map(containerRef.current, { scrollWheelZoom: false, zoomControl: true });
        mapRef.current = map;
        leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18,
        })
          .on('tileerror', () => { if (!disposed) setTileError(true); })
          .addTo(map);

        // Excursions return to London; they are not successive overnight stops.
        leaflet.polyline([locations.london, locations.cambridge], {
          color: '#39756c', weight: 4, opacity: 0.9,
        }).bindPopup('10/01 · 伦敦 London ⇄ 剑桥 Cambridge<br>当天往返，晚宿伦敦。').addTo(map);
        leaflet.polyline([locations.london, locations.lewes, locations.seaford], {
          color: '#a67512', weight: 4, opacity: 0.9,
        }).bindPopup('10/03 · 伦敦 London ⇄ 刘易斯 Lewes ⇄ 锡福德 Seaford<br>经刘易斯 Lewes 换乘，当天回伦敦。').addTo(map);
        leaflet.polyline([locations.seaford, locations.exceat], {
          color: '#537f98', weight: 4, opacity: 0.9,
        }).bindPopup('公交 12 · 锡福德 Seaford ⇄ 七姐妹公园中心公交站 Seven Sisters Park Centre（埃克西特 Exceat）<br>去程乘伊斯特本 Eastbourne 方向；回程乘布莱顿 Brighton 方向到锡福德 Seaford。').addTo(map);
        leaflet.polyline([locations.exceat, locations.bridge, locations.cottages], {
          color: '#a67512', weight: 4, dashArray: '3 7', opacity: 0.9,
        }).bindPopup('观景短线 · 埃克西特 Exceat → 经桥到西岸 → 海岸警卫队小屋 Coastguard Cottages<br>沿正式步道原路返回公交站，不从河口涉水过河。连线仅示方向。').addTo(map);
        leaflet.polyline([locations.london, locations.newcastle], {
          color: '#e84632', weight: 4, opacity: 0.85,
        }).bindPopup('10/04 · 伦敦 London → 爱丁堡 Edinburgh<br>北上途中不安排其他城市游玩。').addTo(map);
        leaflet.polyline([locations.newcastle, locations.carlisle, locations.edinburgh], {
          color: '#e84632', weight: 4, dashArray: '8 7', opacity: 0.9,
        }).bindPopup('10/04 · 工程绕行方向<br>纽卡斯尔 Newcastle → 卡莱尔 Carlisle → 爱丁堡 Edinburgh<br>具体列车、停站与时长以当日售票结果为准。').addTo(map);

        mainStops.forEach((stop) => {
          const icon = leaflet.divIcon({
            className: `trip-map-pin trip-map-pin-${stop.id}`,
            html: `<span class="trip-map-dot" style="background:${stop.color}">${stop.symbol}</span><span class="trip-map-label">${stop.label}</span>`,
            iconSize: [36, 36], iconAnchor: [18, 18],
          });
          leaflet.marker(locations[stop.id], { icon, title: stop.label, riseOnHover: true })
            .bindPopup(`<strong>${stop.label}</strong><br>${stop.detail}`).addTo(map);
        });

        [
          { id: 'heathrow', label: '希思罗 LHR', detail: '09/29 希思罗机场 Heathrow Airport 入境 → 皮卡迪利线 Piccadilly line → 伯爵宫地铁站 Earl’s Court → 伦敦青旅 Barmy Badger Backpackers', destination: 'london' },
          { id: 'edi', label: '爱丁堡 EDI', detail: '10/07 爱丁堡机场 Edinburgh Airport 离境 · 市区乘 Airlink 100 机场巴士或有轨电车 Edinburgh Trams 前往机场', destination: 'edinburgh' },
        ].forEach((airport) => {
          leaflet.polyline([locations[airport.id], locations[airport.destination]], {
            color: '#718292', weight: 2, dashArray: '3 5',
          }).addTo(map);
          leaflet.circleMarker(locations[airport.id], {
            radius: 4, color: '#10243e', fillColor: '#fff', fillOpacity: 1, weight: 2,
          })
            .bindTooltip(airport.label, { permanent: true, direction: 'left', offset: [-8, 0], className: 'trip-airport-label' })
            .bindPopup(`<strong>${airport.label}</strong><br>${airport.detail}`).addTo(map);
        });

        [
          { id: 'newcastle', label: '纽卡斯尔 Newcastle', direction: 'right' as const },
          { id: 'carlisle', label: '卡莱尔 Carlisle', direction: 'left' as const },
        ].forEach((station) => {
          leaflet.circleMarker(locations[station.id], {
            radius: 4, color: '#e84632', fillColor: '#fff', fillOpacity: 1, weight: 2,
          })
            .bindTooltip(station.label, { permanent: true, direction: station.direction, className: 'trip-transit-label' })
            .bindPopup(`<strong>${station.label}</strong><br>10/04 北上绕行方向参照点，不安排游玩。`).addTo(map);
        });

        const coastDetails = leaflet.layerGroup([
          leaflet.circleMarker(locations.lewes, { radius: 5, color: '#a67512', fillColor: '#fff', fillOpacity: 1, weight: 2 })
            .bindTooltip('刘易斯 Lewes · 换乘', { permanent: true, direction: 'left', className: 'trip-transit-label' })
            .bindPopup('刘易斯 Lewes 换乘<br>乘锡福德 Seaford 方向列车，返程在此换乘回伦敦 London。'),
          leaflet.circleMarker(locations.exceat, { radius: 5, color: '#537f98', fillColor: '#fff', fillOpacity: 1, weight: 3 })
            .bindTooltip('埃克西特 Exceat · 公交 12 下车', { permanent: true, direction: 'top', offset: [0, -5], className: 'trip-transit-label' })
            .bindPopup('七姐妹公园中心公交站 Seven Sisters Park Centre · 埃克西特 Exceat<br>乘公交 12 抵达后，可到七姐妹游客中心 Seven Sisters Country Park Visitor Centre 问询，再经埃克西特桥 Exceat Bridge 走到河流西岸。'),
          leaflet.circleMarker(locations.bridge, { radius: 3, color: '#a67512', fillColor: '#fff', fillOpacity: 1, weight: 2 })
            .bindPopup('埃克西特桥 Exceat Bridge<br>从桥上过河，沿西岸正式步道往海岸警卫队小屋 Coastguard Cottages。'),
          leaflet.circleMarker(locations.cottages, { radius: 6, color: '#a67512', fillColor: '#fff', fillOpacity: 1, weight: 3 })
            .bindTooltip('海岸警卫队小屋 Coastguard Cottages', { permanent: true, direction: 'bottom', offset: [0, 8], className: 'trip-transit-label' })
            .bindPopup('海岸警卫队小屋 Coastguard Cottages · 七姐妹白崖 Seven Sisters 观景短线<br>拍照后原路返回埃克西特 Exceat，再乘公交 12 回锡福德 Seaford。'),
        ]);
        const updateDetails = () => {
          if (map.getZoom() >= 9) coastDetails.addTo(map);
          else coastDetails.removeFrom(map);
        };
        map.on('zoomend', updateDetails);
        map.fitBounds(viewBounds.full, { paddingTopLeft: [60, 32], paddingBottomRight: [115, 32] });
        updateDetails();
        resizeObserver = new ResizeObserver(() => map.invalidateSize());
        resizeObserver.observe(containerRef.current);
        setMapReady(true);
      })
      .catch(() => { if (!disposed) setMapError(true); });

    return () => {
      disposed = true;
      resizeObserver?.disconnect();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  const showView = (nextView: MapView) => {
    setView(nextView);
    mapRef.current?.fitBounds(viewBounds[nextView], {
      paddingTopLeft: [60, 32], paddingBottomRight: [115, 32], animate: false,
    });
  };

  return (
    <div className="route-map-v2">
      <div className="trip-map-controls" aria-label="地图范围">
        <div className="trip-map-views">
          {([['full', '查看全程'], ['london', '伦敦周边 London'], ['coast', '白崖短线 Seven Sisters']] as const).map(([id, label]) => (
            <button key={id} type="button" aria-pressed={view === id} disabled={!mapReady || mapError} onClick={() => showView(id)}>{label}</button>
          ))}
        </div>
        <span>点击地点查看安排 · 可缩放</span>
      </div>
      <div className="map-layout">
        <div className="map-frame">
          {mapError ? <output className="map-fallback"><MapPinned /><strong>地图暂时无法载入</strong><span>下方及侧边的地点链接仍可打开导航。</span></output> : null}
          {tileError && !mapError ? <output className="trip-tile-notice">部分底图未加载，路线仍可查看；也可打开地点导航。</output> : null}
          <div ref={containerRef} className="route-map" aria-label="英国旅行地图：以伦敦为基地往返剑桥和白崖，再经工程绕行方向北上爱丁堡" />
        </div>
        <aside className="trip-route-summary" aria-label="住宿基地与往返支线">
          <div className="trip-base-card">
            <span className="trip-base-symbol">伦</span>
            <div><strong>伦敦 London · 5 晚</strong><span>09/29 入住 → 10/04 退房</span><small>{londonStay.name} · 已订<br />伯爵宫 Earl’s Court；两次出游都回这里。</small></div>
            <a href={mapLink(londonStay.query)} target="_blank" rel="noreferrer" aria-label="在 Google Maps 查看伦敦青旅 Barmy Badger Backpackers"><ExternalLink /></a>
          </div>
          <div className="trip-excursions">
            <article className="trip-branch trip-branch-cambridge">
              <p><ArrowLeftRight /> 10/01 · 剑桥 Cambridge 当天往返</p>
              <strong>伦敦 London ⇄ 剑桥 Cambridge</strong><span>国王十字火车站 London King’s Cross ⇄ 剑桥火车站 Cambridge</span>
              <a href={mapLink('Cambridge Station UK')} target="_blank" rel="noreferrer">剑桥火车站 Cambridge <ExternalLink /></a>
            </article>
            <article className="trip-branch trip-branch-coast">
              <p><ArrowLeftRight /> 10/03 · 七姐妹白崖 Seven Sisters 当天往返</p>
              <strong>伦敦 London ⇄ 刘易斯 Lewes ⇄ 锡福德 Seaford</strong><span>锡福德 Seaford 乘公交 12 到埃克西特 Exceat，经桥走西岸至海岸警卫队小屋 Coastguard Cottages；原路返回。</span>
              <div className="trip-place-links"><a href={mapLink('Seaford Railway Station UK')} target="_blank" rel="noreferrer">锡福德火车站 Seaford <ExternalLink /></a><a href={mapLink('Seven Sisters Country Park Visitor Centre Exceat')} target="_blank" rel="noreferrer">七姐妹游客中心 Seven Sisters Country Park Visitor Centre（埃克西特 Exceat）<ExternalLink /></a><a href={mapLink('Coastguard Cottages Cuckmere Haven')} target="_blank" rel="noreferrer">海岸警卫队小屋 Coastguard Cottages <ExternalLink /></a></div>
            </article>
          </div>
          <div className="trip-northbound"><TrainFront /><div><strong>10/04 · 伦敦 London → 爱丁堡 Edinburgh</strong><span>工程绕行：纽卡斯尔 Newcastle → 卡莱尔 Carlisle → 爱丁堡 Edinburgh。此日留足交通时间。</span><a href="https://www.nationalrail.co.uk/engineering-works/ncl-3-oct-20261003/" target="_blank" rel="noreferrer">查看官方工程公告 <ExternalLink /></a></div></div>
          <div className="trip-base-card trip-base-edinburgh">
            <span className="trip-base-symbol">爱</span>
            <div><strong>爱丁堡 Edinburgh · 3 晚</strong><span>10/04 入住 → 10/07 退房</span><small>{edinburghStay.name} · 已订<br />爱丁堡城堡 Edinburgh Castle 脚下；10/07 从爱丁堡机场 Edinburgh Airport（EDI）返程。</small></div>
            <a href={mapLink(edinburghStay.query)} target="_blank" rel="noreferrer" aria-label="在 Google Maps 查看城堡岩青旅 Castle Rock Hostel"><ExternalLink /></a>
          </div>
        </aside>
      </div>
      <div className="trip-map-legend" aria-label="地图图例">
        <span><i className="trip-line-key trip-line-north" /> 北上移动</span>
        <span><i className="trip-line-key trip-line-diversion" /> 工程绕行</span>
        <span><i className="trip-line-key trip-line-cambridge" /> 剑桥往返</span>
        <span><i className="trip-line-key trip-line-coast" /> 白崖往返</span>
        <span><BusFront className="trip-bus-key" /> 公交 12 接驳</span><span><Footprints /> 短线步行</span><span><Plane /> 希思罗 Heathrow（LHR）入境 · 爱丁堡 Edinburgh（EDI）离境</span>
      </div>
      <p className="trip-map-note">连线仅表示移动方向，不是实际铁轨或徒步导航。剑桥与白崖分两天从伦敦出发；白崖日期可随天气调整。绕行列车的时刻、停站及用时，以实际售票结果为准。</p>
    </div>
  );
}
