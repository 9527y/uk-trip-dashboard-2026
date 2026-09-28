export type MapPointKind = 'sight' | 'food' | 'transport' | 'stay';
export type DailyMapPoint = {
  id: string;
  date: string;
  name: string;
  englishName: string;
  lat: number;
  lng: number;
  kind: MapPointKind;
  scope: 'local' | 'connection';
  note: string;
  query: string;
  source?: string;
};

export const pointKinds: Record<MapPointKind, { label: string; color: string }> = {
  sight: { label: '景点', color: '#e84632' },
  food: { label: '餐饮', color: '#a67512' },
  transport: { label: '交通', color: '#28738c' },
  stay: { label: '住宿', color: '#10243e' },
};

export const dayMapLabels: Record<string, { label: string; area: string; note: string }> = {
  '09/29': { label: '伦敦南岸', area: '伦敦桥 · 塔桥', note: '落地后先寄存行李，南岸只走一小段；精力不足就早点回青旅。' },
  '09/30': { label: '王宫与西敏', area: '白金汉宫 · 西敏 · 西区', note: '从王宫经公园向东走，傍晚到唐人街；教堂入内按预约调整。' },
  '10/01': { label: '剑桥', area: '剑桥学院区 · 康河', note: '从伦敦当天往返。撑篙与河畔散步按天气、体力二选一；回程可看国王十字9¾站台。' },
  '10/02': { label: '温网与大英', area: '温布尔登 → 夏洛克外景 → 大英', note: '上午温网留1–1.5小时，中午回市区，下午大英；门票和时段仍需预约。' },
  '10/03': { label: '七姐妹白崖', area: 'Seaford · Exceat · 西岸小屋', note: '经Exceat Bridge走河西岸，到Coastguard Cottages后原路返回；不从河口涉水过河。' },
  '10/04': { label: '北上爱丁堡', area: '伦敦 → 爱丁堡', note: '全天留给铁路转移。施工绕行、换乘和到达时间以实际车票为准，地图不表示铁路走线。' },
  '10/05': { label: '爱丁堡古城', area: '城堡 · 维多利亚街 · 皇家英里', note: '从城堡顺坡逛老城；玛丽金小巷是可选替换项，需要另约。' },
  '10/06': { label: '山景与博物馆', area: '荷里路德公园 · 国家博物馆', note: '天气合适再登山；雨天直接换成博物馆，不另外补走登山线路。' },
  '10/07': { label: '机场返程', area: '爱丁堡老城 → 机场', note: 'Airlink 100和电车二选一，目标09:45到机场；经法兰克福中转，10/8抵达香港。' },
};

export function pointsForDate(points: DailyMapPoint[], date: string, includeConnections: boolean) {
  return points.filter(point => point.date === date && (includeConnections || point.scope === 'local'));
}

export function pointMapUrl(point: DailyMapPoint) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(point.query)}`;
}
