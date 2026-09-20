import { CalendarDays, CheckCircle2, ExternalLink, Luggage, MapPin, Navigation } from 'lucide-react';
import { stays, stayNavigationUrl } from '@/lib/stays';

export function Accommodation() {
  return (
    <section className="section" id="stays" aria-labelledby="stays-title">
      <div className="section-heading"><div><p className="eyebrow"><Luggage /> 住宿</p><h2 id="stays-title">两家青旅，已经订好</h2></div><span className="section-metric">Hostelworld · 共 8 晚</span></div>
      <div className="connection-grid">
        {stays.map((stay) => (
          <article className="connection-card" key={stay.id}>
            <div className="connection-label"><CheckCircle2 /><span>{stay.city} · 已预订 · {stay.nights} 晚</span></div>
            <h3>{stay.name}</h3>
            <p><CalendarDays /><time dateTime={stay.checkIn}>{stay.checkIn.replaceAll('-', '/')}</time> 入住 → <time dateTime={stay.checkOut}>{stay.checkOut.replaceAll('-', '/')}</time> 退房</p>
            <p><MapPin />{stay.address}</p>
            <p>{stay.connection}</p>
            <p>{stay.reminder}</p>
            <div className="connection-actions">
              <a href={stayNavigationUrl(stay)} target="_blank" rel="noreferrer" aria-label={`导航到 ${stay.name}`}><Navigation />去青旅</a>
              <a href={stay.website} target="_blank" rel="noreferrer">青旅官网 <ExternalLink /></a>
            </div>
          </article>
        ))}
      </div>
      <p className="source-note">9/20 已按预订截图确认名称和日期。房型、实付金额、取消条款及入住时间待补充，以订单详情为准。<a href="https://www.hostelworld.com/zh/account/trips/" target="_blank" rel="noreferrer">查看我的 Hostelworld 预订</a></p>
    </section>
  );
}
