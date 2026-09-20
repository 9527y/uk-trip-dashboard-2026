import { BusFront, CircleAlert, ExternalLink, Footprints, Navigation, Plane, TrainFront } from 'lucide-react';
import { transportSources } from '@/lib/trip-plan';

function mapUrl(destination: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=transit`;
}

export function LocalTransport() {
  return (
    <section className="section" id="local-transport" aria-labelledby="local-transport-title">
      <div className="section-heading"><div><p className="eyebrow"><BusFront /> Bus & airport connections</p><h2 id="local-transport-title">公交与机场接驳</h2></div><span className="section-metric">方向、上车点、回程</span></div>
      <p className="section-intro">白崖使用当地公交接驳，北上优先查铁路；长途大巴不作为默认行程。铁路查询如出现替代巴士，先确认上车位置和延长时间。</p>
      <div className="connection-grid">
        <article className="connection-card" id="white-cliffs-bus">
          <div className="connection-label"><BusFront /><span>10/3 · 白崖去程与回程</span></div>
          <h3>Seaford ↔ Seven Sisters Park Centre</h3>
          <ol>
            <li>Seaford 火车站下车，步行到 <strong>Seaford Library</strong> 公交站。</li>
            <li>去程选 <strong>12 路往 Eastbourne</strong>、停靠 Seven Sisters Park Centre／Exceat 的班次；上车前核对车头方向和停站。</li>
            <li>公交短段约 15 分钟，不含步行和等车。下车后经 <strong>Exceat Bridge 到河西岸</strong>，步行去 Coastguard Cottages 看白崖。</li>
            <li>回程按原路回到 Exceat，在往 <strong>Seaford／Brighton</strong> 方向的站点乘车，到 Seaford Library 下车，再步行去火车站。</li>
          </ol>
          <p><Footprints />观景往返步行约 4.8 公里，含拍照休息留 2–3 小时。过河走桥，不涉水穿越河口。</p>
          <p><CircleAlert />9/27 起启用新版时刻表。12X 等班次须另核实停站；下午提前折返，别以末班车为目标。</p>
          <div className="connection-actions"><a href={transportSources.coaster} target="_blank" rel="noreferrer">公交时刻与票价 <ExternalLink /></a><a href={mapUrl('Seaford Library bus stop East Sussex')} target="_blank" rel="noreferrer"><Navigation />去上车点</a><a href={transportSources.walking} target="_blank" rel="noreferrer">官方步行路线 <ExternalLink /></a></div>
        </article>
        <article className="connection-card">
          <div className="connection-label"><Plane /><span>9/29 · 希思罗机场进城</span></div>
          <h3>Heathrow → Barmy Badger</h3>
          <p><TrainFront /><strong>Piccadilly line：</strong>从到达航站楼出发，乘往伦敦市区方向的车到 Earl’s Court，再步行到 17 Longridge Road。正常运营下无需换乘地铁。</p>
          <p>同一住宿去 King’s Cross 可乘 Piccadilly line，去 Victoria 可乘 District line。出发前用 TfL 核对当天线路和工程。</p>
          <p><CircleAlert />07:55 为航班计划落地时间，入境和进城另留余量；到住宿先寄存行李，房间能否提前入住以酒店为准。</p>
          <div className="connection-actions"><a href="https://tfl.gov.uk/plan-a-journey/" target="_blank" rel="noreferrer">TfL 规划进城路线 <ExternalLink /></a><a href="https://www.barmybadger.com/earls-court-hostel" target="_blank" rel="noreferrer">青旅到达指引 <ExternalLink /></a></div>
        </article>
        <article className="connection-card">
          <div className="connection-label"><Plane /><span>10/7 · 爱丁堡去机场</span></div>
          <h3>目标 09:45 到 EDI · 12:50 起飞</h3>
          <p><TrainFront /><strong>机场电车：</strong>从 Castle Rock 步行到 Princes Street 站，乘 Airport 方向。市中心站到机场按约 35 分钟规划，另加步行和等车。</p>
          <p><BusFront /><strong>Airlink 100：</strong>从 Castle Rock 步行到 Waverley Bridge，上车往 Edinburgh Airport。车程按约 40–50 分钟预留，再加候车及步行。</p>
          <p><CircleAlert />暂按 08:15–08:30 从 Castle Rock 出门，包含老城步行接驳余量；实际按航司通知和当天交通倒推。两种交通选一种即可，机场区间需对应车票。</p>
          <div className="connection-actions"><a href="https://edinburghtrams.com/plan-journey/airport" target="_blank" rel="noreferrer">电车时刻与机场票 <ExternalLink /></a><a href="https://www.lothianbuses.com/our-services/airport-buses/" target="_blank" rel="noreferrer">Airlink 100 官网 <ExternalLink /></a><a href={mapUrl('Waverley Bridge Airlink 100 Edinburgh')} target="_blank" rel="noreferrer"><Navigation />公交上车点</a></div>
        </article>
        <article className="connection-card">
          <div className="connection-label"><TrainFront /><span>日常乘车与出行日期</span></div>
          <h3>两处基地，轻装出门</h3>
          <p>伦敦连住 5 晚，剑桥和白崖当天往返；大包留住宿。10/4 才携带全部行李北上爱丁堡。</p>
          <p>伦敦地铁／铁路进出站使用同一张卡或同一设备；公交按当地上车刷卡规则。剑桥、白崖和爱丁堡车票按各运营商规则购买，不把伦敦交通封顶规则套用于全程。</p>
          <p>白崖看天气再确定短线。若与 10/2 伦敦日互换，同步调整博物馆预约、两程火车和公交查询日期。</p>
          <div className="connection-actions"><a href="https://tfl.gov.uk/fares/how-to-pay-and-where-to-buy-tickets-and-oyster/pay-as-you-go/contactless-and-mobile-pay-as-you-go" target="_blank" rel="noreferrer">伦敦刷卡说明 <ExternalLink /></a><a href={transportSources.river} target="_blank" rel="noreferrer">Cuckmere 河口提示 <ExternalLink /></a></div>
        </article>
      </div>
      <p className="source-note">交通入口于 2026-09-19 核对，9/20 按已订青旅更新接驳。车程为规划估算；公交班次、候车时间和票价以所选日期及当天公告为准。</p>
    </section>
  );
}
