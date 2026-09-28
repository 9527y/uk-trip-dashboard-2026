export const TRIP_START = new Date('2026-09-28T23:05:00+08:00').getTime();
export const TRIP_END = new Date('2026-10-08T15:20:00+08:00').getTime();
export const TASK_STORAGE_KEY = 'uk-trip-tasks-v2';
export const TRAIN_STORAGE_KEY = 'uk-trip-trains-v2';

export type TaskItem = { id: string; label: string; detail?: string; group: string; action?: string; href?: string; done: boolean };
export type RailStation = { name: string; code: string; address: string; query: string };
export type TrainItem = {
  id: string; taskId: string; date: string; route: string; local: string; note: string; operator: string;
  from: RailStation; to: RailStation; routePlan: string; arrive: string;
  bookingUrl: string; operatorUrl: string; liveUrl: string; confirmed?: boolean;
};

export function railSearchUrl(origin: string, destination: string, local: string) {
  const [date, time] = local.split('T');
  const [year, month, day] = date.split('-');
  const [hour, minute] = time.split(':');
  const params = new URLSearchParams({ type: 'single', origin, destination, leavingType: 'departing', leavingDate: `${day}${month}${year.slice(2)}`, leavingHour: hour, leavingMin: minute, adults: '1' });
  return `https://www.nationalrail.co.uk/journey-planner/?${params.toString()}`;
}

export const transportSources = {
  engineering: 'https://www.nationalrail.co.uk/engineering-works/ncl-3-oct-20261003/',
  cambridge: 'https://www.greatnorthernrail.com/journey/london-kings-cross-to-cambridge',
  seaford: 'https://www.southernrailway.com/journey/london-victoria-to-seaford',
  coaster: 'https://www.buses.co.uk/services/BH/12',
  walking: 'https://www.sevensisters.org.uk/things-to-do/walking/',
  river: 'https://www.sevensisters.org.uk/stay-safe-at-cuckmere-river-mouth/',
};

const kingsCross: RailStation = { name: "伦敦国王十字火车站 · London King's Cross", code: 'KGX', address: 'Euston Road, London N1 9AL', query: "London King's Cross railway station" };
const cambridge: RailStation = { name: '剑桥火车站 · Cambridge', code: 'CBG', address: 'Station Road, Cambridge CB1 2JW', query: 'Cambridge railway station Station Road' };
const victoria: RailStation = { name: '伦敦维多利亚火车站 · London Victoria', code: 'VIC', address: 'Victoria Street, London SW1V 1JU', query: 'London Victoria railway station' };
const seaford: RailStation = { name: '锡福德火车站 · Seaford (Sussex)', code: 'SEF', address: 'Station Approach, Seaford BN25 2AR', query: 'Seaford railway station East Sussex' };
const edinburgh: RailStation = { name: '爱丁堡威瓦利火车站 · Edinburgh Waverley', code: 'EDB', address: 'Princes Street, Edinburgh EH1 1BB', query: 'Edinburgh Waverley railway station' };

export const trainSeed: TrainItem[] = [
  {
    id: 'lon-cbg', taskId: 'train-cambridge-return', date: '10/01 周四 · 去程', route: "伦敦国王十字 London King's Cross → 剑桥 Cambridge", local: '2026-10-01T08:30', note: '建议搜索 08:00–09:00；未确认班次', operator: 'Great Northern',
    from: kingsCross, to: cambridge,
    routePlan: '优先直达快车，常规约 50–70 分钟；下车后步行约 25–30 分钟到学院区。目的站选剑桥火车站 Cambridge（CBG）。',
    arrive: '从伦敦青旅 Barmy Badger 步行至伯爵宫地铁站 Earl’s Court，乘皮卡迪利线 Piccadilly line 到国王十字圣潘克拉斯地铁站 King’s Cross St Pancras，再步行至国王十字火车站 London King’s Cross；建议发车前 20–30 分钟到火车站，主行李留青旅。',
    bookingUrl: railSearchUrl('KGX', 'CBG', '2026-10-01T08:30'), operatorUrl: transportSources.cambridge, liveUrl: 'https://www.nationalrail.co.uk/live-trains/departures/london-kings-cross/cambridge/',
  },
  {
    id: 'cbg-lon', taskId: 'train-cambridge-return', date: '10/01 周四 · 回程', route: "剑桥 Cambridge → 伦敦国王十字 London King's Cross", local: '2026-10-01T18:00', note: '建议搜索 17:30–19:00；未确认班次', operator: 'Great Northern',
    from: cambridge, to: kingsCross,
    routePlan: '与去程一起比较 Return 往返票和两张 Single。票种可能限制运营商、时间或具体班次，不默认可任意改乘。',
    arrive: '从学院区返回车站另留约 30 分钟，发车前至少 15–20 分钟到站；晚餐可回伦敦后再吃。',
    bookingUrl: railSearchUrl('CBG', 'KGX', '2026-10-01T18:00'), operatorUrl: 'https://www.greatnorthernrail.com/', liveUrl: 'https://www.nationalrail.co.uk/live-trains/departures/cambridge/london-kings-cross/',
  },
  {
    id: 'lon-sea', taskId: 'train-seaford-return', date: '10/03 周六 · 去程', route: '伦敦维多利亚 London Victoria → 锡福德 Seaford · 经刘易斯 Lewes', local: '2026-10-03T08:00', note: '建议搜索 07:30–08:30；看天气确认', operator: 'Southern',
    from: victoria, to: seaford,
    routePlan: '搜索 VIC → SEF，通常在刘易斯 Lewes（LWS）换乘；站到站按约 1.5–2 小时估算。买覆盖全程的票，无需绕到布莱顿 Brighton。',
    arrive: '从伦敦青旅 Barmy Badger 步行至伯爵宫地铁站 Earl’s Court，乘区域线 District line 到维多利亚地铁站 Victoria，再去同名火车站 London Victoria（非长途汽车站 Victoria Coach Station）。若选择 08:00 左右火车，目标 07:30 到火车站；出门前备好午餐、水和外套。',
    bookingUrl: railSearchUrl('VIC', 'SEF', '2026-10-03T08:00'), operatorUrl: transportSources.seaford, liveUrl: 'https://www.nationalrail.co.uk/live-trains/departures/london-victoria/lewes/',
  },
  {
    id: 'sea-lon', taskId: 'train-seaford-return', date: '10/03 周六 · 回程', route: '锡福德 Seaford → 伦敦维多利亚 London Victoria · 经刘易斯 Lewes', local: '2026-10-03T17:00', note: '建议搜索 16:30–18:00；未确认班次', operator: 'Southern',
    from: seaford, to: victoria,
    routePlan: '锡福德 Seaford → 刘易斯 Lewes 换乘 → 伦敦维多利亚火车站 London Victoria；先查回程票适用时段，再决定徒步折返点。全天交通与观景约 10–12 小时。',
    arrive: '下午留足回公交站／火车站的时间；不以最后一班为目标，回伦敦后只安排晚餐和休息。',
    bookingUrl: railSearchUrl('SEF', 'VIC', '2026-10-03T17:00'), operatorUrl: 'https://www.southernrailway.com/', liveUrl: 'https://www.nationalrail.co.uk/live-trains/departures/seaford/lewes/',
  },
  {
    id: 'lon-edi', taskId: 'train-london-edinburgh', date: '10/04 周日 · 换住宿', route: "伦敦国王十字 London King's Cross → 爱丁堡威瓦利 Edinburgh Waverley", local: '2026-10-04T09:30', note: '建议先查上午班次；全天用于转移', operator: 'LNER',
    from: kingsCross, to: edinburgh,
    routePlan: '10/3–4 纽卡斯尔 Newcastle 至爱丁堡 Edinburgh 海岸线施工，LNER 经卡莱尔 Carlisle 绕行并延长旅程。时长、是否换乘和铁路替代巴士以当日查询为准。',
    arrive: '从伦敦青旅 Barmy Badger 退房，经伯爵宫地铁站 Earl’s Court 乘皮卡迪利线 Piccadilly line 到国王十字圣潘克拉斯地铁站 King’s Cross St Pancras，再步行至国王十字火车站 London King’s Cross，建议发车前 30 分钟到站。抵达后入住城堡岩青旅 Castle Rock Hostel，核对晚到安排。',
    bookingUrl: railSearchUrl('KGX', 'EDB', '2026-10-04T09:30'), operatorUrl: 'https://www.lner.co.uk/', liveUrl: 'https://www.nationalrail.co.uk/live-trains/departures/london-kings-cross/edinburgh/',
  },
];

export const milestones = [
  { label: '查看 SWISS 去程值机', time: new Date('2026-09-27T23:05:00+08:00').getTime(), note: '按航司 App 实际开放时间办理' },
  { label: '香港国际机场 Hong Kong International Airport（HKG）起飞', time: TRIP_START, note: '建议 9/28 20:00 前抵达机场' },
  { label: '抵达伦敦希思罗机场 London Heathrow（LHR）', time: new Date('2026-09-29T07:55:00+01:00').getTime(), note: '英国 07:55 · 北京时间 14:55' },
  { label: '查看 Lufthansa 回程值机', time: new Date('2026-10-06T06:50:00+01:00').getTime(), note: '英国时间；以航司实际开放为准' },
  { label: '爱丁堡机场 Edinburgh Airport（EDI）起飞', time: new Date('2026-10-07T12:50:00+01:00').getTime(), note: '目标 09:45 到机场，按航司通知调整' },
  { label: '抵达香港 Hong Kong', time: TRIP_END, note: '10/08 15:20 北京时间，之后返回深圳' },
];

export const taskSeed: TaskItem[] = [
  { id: 'flight', label: '国际机票已确认', group: '已完成', done: true },
  { id: 'visa', label: '英国签证有效', group: '已完成', done: true },
  { id: 'train-london-edinburgh', label: '确认 10/4 伦敦 London → 爱丁堡 Edinburgh 车票', detail: '施工绕行；先核实实际时长和换乘，再订票', group: '优先处理', action: '搜索车次', href: trainSeed[4].bookingUrl, done: false },
  { id: 'stay-london-booked', label: '已订伦敦青旅 Barmy Badger Backpackers · 5 晚', detail: 'Hostelworld · 09/29 入住、10/04 退房', group: '已完成', action: '住宿信息', href: '#stays', done: true },
  { id: 'stay-edinburgh-booked', label: '已订城堡岩青旅 Castle Rock Hostel · 3 晚', detail: 'Hostelworld · 10/04 入住、10/07 退房', group: '已完成', action: '住宿信息', href: '#stays', done: true },
  { id: 'train-cambridge-return', label: '确认 10/1 剑桥 Cambridge 往返两程车票', detail: 'KGX ↔ CBG；一起比较往返票和两张单程票', group: '城外出行', action: '搜索车次', href: trainSeed[0].bookingUrl, done: false },
  { id: 'train-seaford-return', label: '确认七姐妹白崖 Seven Sisters 当天的往返车票', detail: '暂定 10/3；VIC ↔ SEF 经刘易斯 Lewes，结合天气和票种决定', group: '城外出行', action: '搜索车次', href: trainSeed[2].bookingUrl, done: false },
  { id: 'white-cliffs-plan', label: '确认七姐妹白崖 Seven Sisters 短线与返程公交', detail: '查风雨、9/27 起公交新表和末班；选择观景短线', group: '城外出行', action: '查公交', href: transportSources.coaster, done: false },
  { id: 'westminster-abbey', label: '决定是否预约威斯敏斯特教堂 Westminster Abbey', detail: '09/30 下午可选；不入内也可沿公园与河岸散步', group: '景点安排', action: '官网查看', href: 'https://www.westminster-abbey.org/visit-us', done: false },
  { id: 'cambridge-college', label: '确认 10/1 国王学院 King’s College, Cambridge 开放与门票', detail: '只选一所学院；撑篙看天气，不把多个学院排满', group: '景点安排', action: '官网查看', href: 'https://www.kings.cam.ac.uk/visit-kings', done: false },
  { id: 'museum-oct2', label: '预约 10/2 大英博物馆 British Museum 免费时段', detail: '建议上午；若与白崖调换日期，同步调整预约', group: '景点安排', action: '官网预约', href: 'https://www.britishmuseum.org/visit', done: false },
  { id: 'edinburgh-castle', label: '预约爱丁堡城堡 Edinburgh Castle', detail: '10/05 上午；按实际预约时间入场', group: '景点安排', action: '官网预约', href: 'https://www.edinburghcastle.scot/plan-your-visit/tickets', done: false },
  { id: 'leave-dates', label: '请假：9/29、9/30、10/8', detail: '北京时间共 3 天；9/28 下班赴港，10/9 上班、10/10 补班', group: '出发准备', done: false },
  { id: 'insurance', label: '购买旅行保险', detail: '核对医疗、延误和行李保障范围', group: '出发准备', done: false },
  { id: 'card-first-payment', label: '确认银行卡可境外支付，现金暂留 £20', detail: '能刷卡就刷卡；£20 中留 £10 预备可退钥匙押金，核对主用卡及备用支付方式', group: '出发准备', action: '付款安排', href: '#money', done: false },
  { id: 'data-plan', label: '确认英国上网方案', detail: '按已买的 SIM／eSIM 套餐确认激活方式、有效期和流量', group: '出发准备', done: false },
  { id: 'bags', label: '核对 Economy Light 行李额度', detail: '确认两个背包分别符合 cabin bag / personal item', group: '出发准备', done: false },
  { id: 'pack-shell', label: '装入防风防水连帽外套', detail: '白崖与爱丁堡每天随身带', group: '打包', done: false },
  { id: 'pack-warm', label: '装入抓绒或薄毛衣保暖层', detail: '结合临行预报决定是否加轻薄羽绒', group: '打包', done: false },
  { id: 'pack-clothes', label: '准备快干衣物与长裤', detail: '上衣 3–4 件、长裤 2 条、内衣袜 4 套，中途洗衣', group: '打包', done: false },
  { id: 'pack-shoes', label: '准备防滑耐走鞋', detail: '海岸和山路需要抓地力，不穿新鞋直接长走', group: '打包', done: false },
  { id: 'pack-tools', label: '准备转换插头、小锁和防水袋', detail: '自带挂锁、毛巾和转换头，减少青旅现金收费；加水瓶、充电宝', group: '打包', done: false },
  { id: 'weather-coast', label: '核对伦敦、剑桥、白崖和爱丁堡天气', detail: '临行和每天出门前看风雨；白崖可与伦敦日调换', group: '临行复核', done: false },
  { id: 'airport', label: '确定深圳 Shenzhen → 香港国际机场 HKG 去程交通', detail: '目标 9/28 20:00 前到香港国际机场 Hong Kong International Airport（HKG）；如有需要提前下班', group: '出发准备', done: false },
  { id: 'edi-airport', label: '确认 10/7 机场电车或 Airlink 100', detail: '从城堡岩青旅 Castle Rock Hostel 出发；选威瓦利桥 Waverley Bridge 的 Airlink 100 机场巴士或王子街 Princes Street 电车，目标 09:45 到爱丁堡机场 Edinburgh Airport（EDI）', group: '出发准备', action: '查电车', href: 'https://edinburghtrams.com/plan-journey/airport', done: false },
  { id: 'offline-v2', label: '保存新版路线、车票与地址', detail: '含两次当天往返、白崖返程公交、北上工程公告', group: '临行复核', done: false },
  { id: 'checkin', label: '完成去程在线值机', detail: '临行查看 SWISS App，保存两段登机牌', group: '9/27–9/28', done: false },
];

export const taskSections = [
  { title: '已确认', ids: ['flight', 'visa', 'stay-london-booked', 'stay-edinburgh-booked'] },
  { title: '先锁定北上交通', ids: ['train-london-edinburgh'] },
  { title: '两次当天往返与景点安排', ids: ['train-cambridge-return', 'train-seaford-return', 'white-cliffs-plan', 'westminster-abbey', 'cambridge-college', 'museum-oct2', 'edinburgh-castle'] },
  { title: '轻装与出发准备', ids: ['leave-dates', 'insurance', 'card-first-payment', 'data-plan', 'bags', 'pack-shell', 'pack-warm', 'pack-clothes', 'pack-shoes', 'pack-tools', 'weather-coast', 'airport', 'edi-airport', 'offline-v2', 'checkin'] },
];

export const prepStages = [
  { end: new Date('2026-09-23T00:00:00+08:00').getTime(), range: '现在–9/22', title: '锁定北上交通', summary: '两地 8 晚青旅已订；接着确认施工日的北上车票与景点预约。', taskIds: ['train-london-edinburgh', 'leave-dates', 'train-cambridge-return', 'cambridge-college', 'museum-oct2', 'edinburgh-castle'] },
  { end: new Date('2026-09-27T00:00:00+08:00').getTime(), range: '9/23–9/26', title: '补齐出行与装备', summary: '复核公交、天气、上网和机场交通，白崖按短线准备。', taskIds: ['train-seaford-return', 'white-cliffs-plan', 'insurance', 'card-first-payment', 'data-plan', 'bags', 'pack-shell', 'pack-warm', 'pack-clothes', 'pack-shoes', 'pack-tools', 'weather-coast', 'airport', 'edi-airport'] },
  { end: TRIP_START, range: '9/27–9/28', title: '值机与出发', summary: '保存票券，按起飞时间倒推赴港和到机场的时间。', taskIds: ['checkin', 'offline-v2', 'bags', 'airport', 'weather-coast'] },
];

export function isValidTrainTime(value: unknown): value is string {
  if (typeof value !== 'string' || !/^2026-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return false;
  const timestamp = Date.parse(`${value}:00Z`);
  return Number.isFinite(timestamp) && new Date(timestamp).toISOString().slice(0, 16) === value;
}

export function restoreTasks(value: unknown): Record<string, boolean> {
  const saved = value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
  return Object.fromEntries(taskSeed.map(task => {
    const completed = saved[task.id];
    return [task.id, typeof completed === 'boolean' ? completed : task.done];
  }));
}

export function restoreTrains(value: unknown): TrainItem[] {
  const saved = Array.isArray(value) ? value : [];
  return trainSeed.map(train => {
    const match = saved.find(item => item && typeof item === 'object' && item.id === train.id);
    return match && isValidTrainTime(match.local) && match.confirmed === true
      ? { ...train, local: match.local, note: `票面时间 ${match.local.slice(11)}`, confirmed: true }
      : { ...train };
  });
}
