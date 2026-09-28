import { ExternalLink, MapPin } from 'lucide-react';

const londonNames = [
  ['白金汉宫', 'Buckingham Palace', 'Buckingham Palace London'],
  ['圣詹姆斯公园', "St James's Park", "St James's Park London"],
  ['威斯敏斯特教堂', 'Westminster Abbey', 'Westminster Abbey London'],
  ['议会广场', 'Parliament Square', 'Parliament Square London'],
  ['大本钟', 'Big Ben', 'Big Ben London'],
  ['英国国会大厦／威斯敏斯特宫', 'Palace of Westminster / Houses of Parliament', 'Palace of Westminster London'],
  ['白厅大街', 'Whitehall', 'Whitehall London'],
  ['皇家骑兵卫队白厅入口', 'Horse Guards', 'Horse Guards Whitehall London'],
  ['骑兵卫队阅兵场', 'Horse Guards Parade', 'Horse Guards Parade London'],
  ['特拉法加广场', 'Trafalgar Square', 'Trafalgar Square London'],
  ['英国国家美术馆', 'The National Gallery', 'The National Gallery London Trafalgar Square'],
  ['金禧步行桥', 'Golden Jubilee Bridges', 'Golden Jubilee Bridges London'],
  ['堤岸地铁站', 'Embankment Underground Station', 'Embankment Underground Station London'],
  ['大英博物馆', 'The British Museum', 'The British Museum Great Russell Street London'],
  ['科文特花园', 'Covent Garden', 'Covent Garden London'],
  ['七晷街区', 'Seven Dials', 'Seven Dials London'],
  ['苏活区', 'Soho', 'Soho London'],
  ['伦敦唐人街', 'Chinatown London', 'Chinatown London Gerrard Street'],
  ['伦敦桥', 'London Bridge', 'London Bridge London'],
  ['伦敦桥火车站', 'London Bridge Station', 'London Bridge railway station London'],
  ['塔桥', 'Tower Bridge', 'Tower Bridge London'],
  ['海斯拱廊', "Hay's Galleria", "Hay's Galleria London"],
  ['博罗市场', 'Borough Market', 'Borough Market London'],
] as const;

export function PlaceReference() {
  return (
    <section className="section" id="place-names" aria-labelledby="place-names-title">
      <div className="section-heading"><div><p className="eyebrow"><MapPin /> 中英地名</p><h2 id="place-names-title">问路、搜地图，直接用英文名</h2></div></div>
      <p className="section-intro">每天的地点已标注中文和英文。下面也收录了刚讨论过的伦敦散步参考点；具体去哪些地方，以当天行程为准。英文搜索词可直接复制。</p>
      <details className="place-reference" open>
        <summary>伦敦景点与街区 · London</summary>
        <div className="place-reference-grid">
          {londonNames.map(([chinese, english, query]) => (
            <article key={query}>
              <strong>{chinese}</strong><span lang="en">{english}</span>
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`} target="_blank" rel="noreferrer" aria-label={`在 Google Maps 搜索 ${chinese} ${english}`}><span lang="en">{query}</span><ExternalLink /></a>
            </article>
          ))}
        </div>
      </details>
      <p className="source-note">伦敦桥 London Bridge 和塔桥 Tower Bridge 是不同的桥；英国国家美术馆 The National Gallery 和大英博物馆 The British Museum 是不同的馆。泰晤士河 River Thames 范围很大，河景导航请选具体的桥或河岸地点。骑兵入口搜 Horse Guards，阅兵场搜 Horse Guards Parade。</p>
    </section>
  );
}
