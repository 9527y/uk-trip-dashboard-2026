'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  CloudRain,
  Clock3,
  Coins,
  ExternalLink,
  Footprints,
  ForkKnife,
  Luggage,
  MapPin,
  MapPinned,
  Navigation,
  Pencil,
  Plane,
  RotateCcw,
  Shirt,
  TicketCheck,
  TrainFront,
  Umbrella,
  WalletCards,
  Wind,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress, ProgressLabel, ProgressValue } from '@/components/ui/progress';
import { RouteMap } from '@/components/route-map';

const TRIP_START = new Date('2026-09-28T23:05:00+08:00').getTime();
const TRIP_END = new Date('2026-10-08T15:20:00+08:00').getTime();

type Place = { name: string; query: string; mode: string };
type TaskItem = { id: string; label: string; detail?: string; group: string; action?: string; href?: string; done: boolean };
type RailStation = { name: string; code: string; address: string; query: string };
type TrainItem = {
  id: string;
  taskId: string;
  date: string;
  route: string;
  local: string;
  note: string;
  operator: string;
  from: RailStation;
  to: RailStation;
  routePlan: string;
  arrive: string;
  bookingUrl: string;
  operatorUrl: string;
  liveUrl: string;
};
type DayStep = { text: string; location: Place; trainId?: string };
type DayMeal = { time: string; name: string; dish: string; price: string; location: Place };
type TripDay = {
  date: string;
  weekday: string;
  city: string;
  title: string;
  start: string;
  end: string;
  steps: DayStep[];
  food: DayMeal[];
  flow: string[];
  wear: string;
  mustDo: string;
  tip: string;
};

function railSearchUrl(origin: string, destination: string, date: string, hour: string, minute: string) {
  const params = new URLSearchParams({
    type: 'single',
    origin,
    destination,
    leavingType: 'departing',
    leavingDate: date,
    leavingHour: hour,
    leavingMin: minute,
    adults: '1',
  });
  return `https://www.nationalrail.co.uk/journey-planner/?${params.toString()}`;
}

const railBookingLinks = {
  'train-lon-oxf': railSearchUrl('PAD', 'OXF', '021026', '08', '00'),
  'train-oxf-bth': railSearchUrl('OXF', 'BTH', '021026', '16', '00'),
  'train-bth-yor': railSearchUrl('BTH', 'YRK', '031026', '14', '00'),
  'train-yor-edi': railSearchUrl('YRK', 'EDB', '041026', '15', '30'),
};

const milestones = [
  { label: 'SWISS 去程值机开放', time: new Date('2026-09-27T23:05:00+08:00').getTime(), note: '若尚未开放，9/28 00:05 再试' },
  { label: 'HKG 起飞', time: TRIP_START, note: '建议 20:00 前抵达机场' },
  { label: '抵达 London Heathrow', time: new Date('2026-09-29T07:55:00+01:00').getTime(), note: '英国当地时间' },
  { label: 'Lufthansa 回程值机开放', time: new Date('2026-10-06T06:50:00+01:00').getTime(), note: 'Edinburgh 当地时间' },
  { label: 'EDI 起飞', time: new Date('2026-10-07T12:50:00+01:00').getTime(), note: '09:45–10:00 抵达机场' },
  { label: '抵达 Hong Kong', time: TRIP_END, note: '10/08 15:20 香港时间' },
];

const taskSeed: TaskItem[] = [
  { id: 'flight', label: '国际机票已确认', group: '已完成', done: true },
  { id: 'visa', label: '英国签证有效', group: '已完成', done: true },
  { id: 'train-lon-oxf', label: '买 Paddington → Oxford 火车', detail: '10/02 早上；优先 GWR 直达', group: '现在购买', action: '搜索车次', href: railBookingLinks['train-lon-oxf'], done: false },
  { id: 'train-oxf-bth', label: '买 Oxford → Bath Spa 火车', detail: '10/02 下午；直达优先，否则 1 次换乘', group: '现在购买', action: '搜索车次', href: railBookingLinks['train-oxf-bth'], done: false },
  { id: 'train-bth-yor', label: '买 Bath Spa → York 火车', detail: '10/03 下午；一张通票，换乘至少 20 分钟', group: '现在购买', action: '搜索车次', href: railBookingLinks['train-bth-yor'], done: false },
  { id: 'train-yor-edi', label: '买 York → Edinburgh 火车', detail: '10/04 下午；优先 LNER 直达', group: '现在购买', action: '搜索车次', href: railBookingLinks['train-yor-edi'], done: false },
  { id: 'stay-london', label: '预订 London 3 晚住宿', detail: '09/29–10/02；确认寄存和最晚入住时间', group: '现在购买', done: false },
  { id: 'stay-bath', label: '预订 Bath 1 晚住宿', detail: '10/02–10/03；优先 Bath Spa 步行范围', group: '现在购买', done: false },
  { id: 'stay-york', label: '预订 York 1 晚住宿', detail: '10/03–10/04；优先车站与城墙之间', group: '现在购买', done: false },
  { id: 'stay-edinburgh', label: '预订 Edinburgh 3 晚住宿', detail: '10/04–10/07；优先 Old Town / Waverley', group: '现在购买', done: false },
  { id: 'tower', label: '预约 Tower of London', detail: '09/30 09:00 首个时段', group: '本周', action: '官网预约', href: 'https://www.hrp.org.uk/tower-of-london/visit/tickets-and-prices/', done: false },
  { id: 'museum', label: '预约 British Museum', detail: '10/01 10:00；免费时段', group: '本周', action: '官网预约', href: 'https://www.britishmuseum.org/visit', done: false },
  { id: 'oxford-college', label: '选择并预约一所 Oxford 学院', detail: '10/02；New College 或 Christ Church 二选一', group: '本周', action: '查看 New College', href: 'https://www.new.ox.ac.uk/visiting-the-college', done: false },
  { id: 'roman-baths', label: '预约 Roman Baths', detail: '10/03 09:00 首个时段', group: '本周', action: '官网预约', href: 'https://www.romanbaths.co.uk/tickets', done: false },
  { id: 'york-minster', label: '预约 York Minster', detail: '10/04 周日约 12:45；留意礼拜安排', group: '本周', action: '官网查看', href: 'https://yorkminster.org/visit/plan-your-visit/', done: false },
  { id: 'edinburgh-castle', label: '预约 Edinburgh Castle', detail: '10/05 09:30 首个时段', group: '本周', action: '官网预约', href: 'https://www.edinburghcastle.scot/plan-your-visit/tickets', done: false },
  { id: 'insurance', label: '购买旅行保险', detail: '覆盖医疗、延误和行李风险', group: '出发前一周', done: false },
  { id: 'esim', label: '开通 UK eSIM', detail: '保存二维码，落地后再启用数据漫游', group: '出发前一周', done: false },
  { id: 'bags', label: '核对 Economy Light 行李额度', detail: '确认两个背包分别符合 cabin bag / personal item', group: '出发前一周', done: false },
  { id: 'pack-shell', label: '装入防风防水连帽外套', detail: '全程每天随身，Edinburgh 尤其需要', group: '打包', done: false },
  { id: 'pack-warm', label: '装入抓绒或薄毛衣保暖层', detail: '怕冷再加一件可压缩轻薄羽绒', group: '打包', done: false },
  { id: 'pack-clothes', label: '准备快干衣物与长裤', detail: '上衣 3–4 件、长裤 2 条、内衣袜 4 套，中途洗衣', group: '打包', done: false },
  { id: 'pack-shoes', label: '准备防滑耐走鞋', detail: '略防水；不带第二双笨重鞋', group: '打包', done: false },
  { id: 'pack-tools', label: '准备转换插头、小锁和防水袋', detail: 'Hostel 储物柜常需自备小锁', group: '打包', done: false },
  { id: 'weather', label: '查看四城天气与 Edinburgh 风力', detail: '9/22 后查看逐日预报，再决定是否带轻薄羽绒', group: '出发前一周', done: false },
  { id: 'airport', label: '确定深圳 → HKG 去程交通', detail: '倒推跨境时间，目标 9/28 20:00 前到 HKG', group: '出发前一周', done: false },
  { id: 'offline', label: '离线保存所有票券与地址', detail: '机票、住宿、火车、景点门票各存一份', group: '起飞前', done: false },
  { id: 'checkin', label: '完成去程在线值机', detail: '9/27 23:05 后尝试；准备护照和预订编号', group: '9/27–9/28', done: false },
];

const taskSections = [
  { title: '已确认', ids: ['flight', 'visa'] },
  { title: '现在购买 · 价格和余量会变', ids: ['train-lon-oxf', 'train-oxf-bth', 'train-bth-yor', 'train-yor-edi', 'stay-london', 'stay-bath', 'stay-york', 'stay-edinburgh'] },
  { title: '本周预约 · 固定入场时间', ids: ['tower', 'museum', 'oxford-college', 'roman-baths', 'york-minster', 'edinburgh-castle'] },
  { title: '轻装与出发准备', ids: ['insurance', 'esim', 'bags', 'pack-shell', 'pack-warm', 'pack-clothes', 'pack-shoes', 'pack-tools', 'weather', 'airport', 'offline', 'checkin'] },
];

const prepStages = [
  {
    end: new Date('2026-09-15T00:00:00+08:00').getTime(),
    range: '现在–9/14',
    title: '预订与锁定阶段',
    summary: '先处理价格和余量最容易变化的项目。',
    taskIds: ['train-lon-oxf', 'train-oxf-bth', 'train-bth-yor', 'train-yor-edi', 'stay-london', 'stay-bath', 'stay-york', 'stay-edinburgh', 'tower', 'museum', 'oxford-college', 'roman-baths', 'york-minster', 'edinburgh-castle'],
  },
  {
    end: new Date('2026-09-25T00:00:00+08:00').getTime(),
    range: '9/15–9/24',
    title: '确认与补齐阶段',
    summary: '把保险、网络、行李和机场交通逐项确认。',
    taskIds: ['insurance', 'esim', 'bags', 'pack-shell', 'pack-warm', 'pack-clothes', 'pack-shoes', 'pack-tools', 'weather', 'airport', 'offline'],
  },
  {
    end: TRIP_START,
    range: '9/25–9/28',
    title: '值机与出发阶段',
    summary: '收好证件和登机牌，按起飞时间倒推到机场。',
    taskIds: ['checkin', 'offline', 'bags', 'airport'],
  },
];

const trainSeed: TrainItem[] = [
  {
    id: 'lon-oxf', taskId: 'train-lon-oxf', date: '10/02 周五', route: 'London Paddington → Oxford', local: '2026-10-02T08:00', note: '目标窗口 07:50–08:30', operator: 'GWR',
    from: { name: 'London Paddington', code: 'PAD', address: 'Praed Street, London W2 1HQ', query: 'London Paddington Station' },
    to: { name: 'Oxford', code: 'OXF', address: 'Park End Street, Oxford OX1 1HS', query: 'Oxford Railway Station' },
    routePlan: '优先 GWR 直达，通常约 52–60 分钟。', arrive: '建议 07:25–07:35 到主站大厅；先找大屏上的 Oxford 和发车时间。',
    bookingUrl: railBookingLinks['train-lon-oxf'], operatorUrl: 'https://www.gwr.com/stations-and-destinations/popular-routes/london-to-oxford', liveUrl: 'https://www.nationalrail.co.uk/live-trains/departures/london-paddington/oxford/',
  },
  {
    id: 'oxf-bth', taskId: 'train-oxf-bth', date: '10/02 周五', route: 'Oxford → Bath Spa', local: '2026-10-02T16:30', note: '目标窗口 16:00–17:00', operator: 'GWR',
    from: { name: 'Oxford', code: 'OXF', address: 'Park End Street, Oxford OX1 1HS', query: 'Oxford Railway Station' },
    to: { name: 'Bath Spa', code: 'BTH', address: 'Dorchester Street, Bath BA1 1SU', query: 'Bath Spa Railway Station' },
    routePlan: '优先 Oxford–Bristol 方向的 GWR 直达；若时间不合适，接受 1 次换乘。', arrive: '最晚发车前 30 分钟从市中心往回走，发车前 20 分钟进入 Oxford 站。',
    bookingUrl: railBookingLinks['train-oxf-bth'], operatorUrl: 'https://www.gwr.com/bristol-oxford-direct', liveUrl: 'https://www.nationalrail.co.uk/live-trains/departures/oxford/bath-spa/',
  },
  {
    id: 'bth-yor', taskId: 'train-bth-yor', date: '10/03 周六', route: 'Bath Spa → York', local: '2026-10-03T14:30', note: '目标窗口 14:00–15:00', operator: 'GWR + CrossCountry',
    from: { name: 'Bath Spa', code: 'BTH', address: 'Dorchester Street, Bath BA1 1SU', query: 'Bath Spa Railway Station' },
    to: { name: 'York', code: 'YRK', address: 'Station Road, York YO24 1AB', query: 'York Railway Station' },
    routePlan: '通常先到 Bristol Temple Meads，再换 CrossCountry 北上；购买一张 BTH→YRK 通票，换乘至少留 20 分钟。', arrive: '13:30 左右回住宿取包，建议发车前 25–30 分钟到 Bath Spa。',
    bookingUrl: railBookingLinks['train-bth-yor'], operatorUrl: 'https://www.crosscountrytrains.co.uk/', liveUrl: 'https://www.nationalrail.co.uk/live-trains/departures/bath-spa/york/',
  },
  {
    id: 'yor-edi', taskId: 'train-yor-edi', date: '10/04 周日', route: 'York → Edinburgh Waverley', local: '2026-10-04T16:00', note: '目标窗口 15:30–16:30', operator: 'LNER',
    from: { name: 'York', code: 'YRK', address: 'Station Road, York YO24 1AB', query: 'York Railway Station' },
    to: { name: 'Edinburgh Waverley', code: 'EDB', address: 'Princes Street, Edinburgh EH1 1BB', query: 'Edinburgh Waverley Station' },
    routePlan: '优先 LNER 直达，通常约 2.5 小时；预订座位并把 Coach / Seat 截图。', arrive: '14:30 离开 Minster，取包后建议发车前 25 分钟到 York 站。',
    bookingUrl: railBookingLinks['train-yor-edi'], operatorUrl: 'https://www.lner.co.uk/routes/york-to-edinburgh-trains/are-there-direct-trains-from-york-to-edinburgh/', liveUrl: 'https://www.nationalrail.co.uk/live-trains/departures/york/edinburgh/',
  },
];

const days: TripDay[] = [
  {
    date: '09/29', weekday: '周二', city: 'London', title: '初见伦敦 · Westminster',
    start: '2026-09-29T07:55:00+01:00', end: '2026-09-29T23:59:00+01:00',
    steps: [
      { text: '07:55–10:30 抵达 LHR、入境，乘 Elizabeth line 进城并寄存背包', location: { name: 'London Heathrow Airport', query: 'London Heathrow Airport', mode: 'transit' } },
      { text: '12:30–16:30 Westminster → St James’s Park → Buckingham Palace', location: { name: 'Buckingham Palace', query: 'Buckingham Palace London', mode: 'walking' } },
      { text: '16:30–18:30 Trafalgar Square → South Bank，随后早点休息', location: { name: 'South Bank', query: 'South Bank London', mode: 'walking' } },
    ],
    food: [
      { time: '早午餐', name: 'Regency Café', dish: '英式早餐套餐', price: '£9.99', location: { name: 'Regency Café', query: 'Regency Cafe 17-19 Regency Street London', mode: 'walking' } },
      { time: '晚餐', name: 'Chinatown', dish: '面食或烧味饭', price: '£12–18', location: { name: 'London Chinatown', query: 'Chinatown Gerrard Street London', mode: 'walking' } },
    ],
    flow: ['step:0', 'meal:0', 'step:1', 'step:2', 'meal:1'],
    wear: '薄长袖或短袖 + 防水外套；机舱用的抓绒放在背包最上层。',
    mustDo: '入境后先去住宿寄存背包；第一天不安排必须准点入场的景点。',
    tip: '第一天不要排长队景点，给入境和时差留余量。',
  },
  {
    date: '09/30', weekday: '周三', city: 'London', title: '城堡、塔桥与河岸',
    start: '2026-09-30T00:00:00+01:00', end: '2026-09-30T23:59:00+01:00',
    steps: [
      { text: '08:40 到达；09:00–11:30 Tower of London，先看 Crown Jewels', location: { name: 'Tower of London', query: 'Tower of London', mode: 'transit' } },
      { text: '11:30–14:00 Tower Bridge → Borough Market 午餐', location: { name: 'Borough Market', query: 'Borough Market London', mode: 'walking' } },
      { text: '14:00–18:00 Tate Modern → Millennium Bridge → St Paul’s 外观', location: { name: 'St Paul’s Cathedral', query: "St Paul's Cathedral London", mode: 'walking' } },
    ],
    food: [
      { time: '午餐', name: 'Shellseekers / Applebee’s Fish', dish: '鱼肉三明治或海鲜', price: '£12–20', location: { name: 'Borough Market', query: 'Borough Market London', mode: 'walking' } },
      { time: '晚餐', name: 'Roti King Euston', dish: 'Roti canai 或 nasi lemak', price: '£12–18', location: { name: 'Roti King Euston', query: 'Roti King Euston London', mode: 'transit' } },
    ],
    flow: ['step:0', 'step:1', 'meal:0', 'step:2', 'meal:1'],
    wear: '薄长袖 + 防水外套 + 防滑步行鞋；河边风大时加抓绒。',
    mustDo: '08:40 前到 Tower of London；门票截图并离线保存。',
    tip: 'Kappacasein 周三关闭；不要专程排它的芝士吐司。',
  },
  {
    date: '10/01', weekday: '周四', city: 'London', title: '博物馆与西区街巷',
    start: '2026-10-01T00:00:00+01:00', end: '2026-10-01T23:59:00+01:00',
    steps: [
      { text: '09:40 到达；10:00–12:30 British Museum，只选 2–3 个主题', location: { name: 'British Museum', query: 'British Museum London', mode: 'transit' } },
      { text: '14:00–16:00 Covent Garden → Seven Dials', location: { name: 'Seven Dials', query: 'Seven Dials London', mode: 'walking' } },
      { text: '16:00–19:00 Soho → Chinatown；体力足够再进 National Gallery', location: { name: 'National Gallery', query: 'National Gallery London', mode: 'walking' } },
    ],
    food: [
      { time: '午餐', name: 'Master Wei · Bloomsbury', dish: '油泼或牛肉 biangbiang 面', price: '£13–18', location: { name: 'Master Wei Xi’an Cuisine', query: "Master Wei Xi'an Cuisine Bloomsbury London", mode: 'walking' } },
      { time: '补给', name: '超市 meal deal', dish: '三明治 + 零食 + 饮料', price: '约 £5', location: { name: 'Soho 周边超市', query: 'supermarket near Soho London', mode: 'walking' } },
    ],
    flow: ['step:0', 'meal:0', 'step:1', 'step:2', 'meal:1'],
    wear: '薄长袖 + 轻外套；博物馆内较暖，保暖层要方便脱下。',
    mustDo: '晚上收好两段火车电子票，确认 Paddington 的出发时间。',
    tip: '晚上整理行李并下载第二天两段火车票。',
  },
  {
    date: '10/02', weekday: '周五', city: 'Oxford → Bath', title: '大学城与古罗马温泉城',
    start: '2026-10-02T00:00:00+01:00', end: '2026-10-02T23:59:00+01:00',
    steps: [
      { text: '07:25 到 Paddington；07:50–08:30 窗口乘 GWR 至 Oxford', location: { name: 'London Paddington', query: 'London Paddington Station', mode: 'transit' }, trainId: 'lon-oxf' },
      { text: '09:30–15:00 Christ Church Meadow → Radcliffe Camera → 一所学院', location: { name: 'Radcliffe Camera', query: 'Radcliffe Camera Oxford', mode: 'walking' } },
      { text: '15:30 回 Oxford 站；16:00–17:00 窗口前往 Bath Spa', location: { name: 'Oxford Station', query: 'Oxford Railway Station', mode: 'transit' }, trainId: 'oxf-bth' },
    ],
    food: [
      { time: '午餐', name: 'Oxford Covered Market', dish: 'Sasi’s Thai / Pieminister', price: '£9–14', location: { name: 'Oxford Covered Market', query: 'Oxford Covered Market', mode: 'walking' } },
      { time: '晚餐', name: 'Chaiwalla · Bath', dish: '咖喱饭或 wrap + samosa', price: '£8–10', location: { name: 'Chaiwalla Bath', query: 'Chaiwalla Bath', mode: 'walking' } },
    ],
    flow: ['step:0', 'meal:0', 'step:1', 'step:2', 'meal:1'],
    wear: '长袖 + 可收纳抓绒 + 防水外套；换城时把最占空间的一层穿身上。',
    mustDo: '随身带两段火车票；Oxford 的背包寄存要在出发前确定。',
    tip: 'Oxford 只参观一所学院，宁可从容赶车。',
  },
  {
    date: '10/03', weekday: '周六', city: 'Bath → York', title: 'Roman Baths 与北上列车',
    start: '2026-10-03T00:00:00+01:00', end: '2026-10-03T23:59:00+01:00',
    steps: [
      { text: '08:40 到达；09:00–10:45 Roman Baths', location: { name: 'Roman Baths', query: 'Roman Baths Bath UK', mode: 'walking' } },
      { text: '11:00–13:15 Bath Abbey → The Circus → Royal Crescent', location: { name: 'Royal Crescent', query: 'Royal Crescent Bath', mode: 'walking' } },
      { text: '13:30 取包；14:00–15:00 窗口从 Bath Spa 北上 York', location: { name: 'Bath Spa', query: 'Bath Spa Railway Station', mode: 'transit' }, trainId: 'bth-yor' },
    ],
    food: [
      { time: '早午餐', name: 'Sally Lunn’s', dish: 'Sally Lunn bun', price: '£8–15', location: { name: 'Sally Lunn’s Historic Eating House', query: "Sally Lunn's Historic Eating House Bath", mode: 'walking' } },
      { time: '列车餐', name: '超市补给', dish: '水、三明治和水果', price: '£6–9', location: { name: 'Bath Spa Station 周边超市', query: 'supermarket near Bath Spa Station', mode: 'walking' } },
    ],
    flow: ['step:0', 'meal:0', 'step:1', 'meal:1', 'step:2'],
    wear: '长袖 + 抓绒 + 防水外套；石板路和可能的雨天需要防滑鞋。',
    mustDo: 'Roman Baths 前把大包留在住宿；13:30 回去取包并买好列车餐。',
    tip: 'Sally Lunn’s 12:30–14:30 最忙，Roman Baths 后尽早去。',
  },
  {
    date: '10/04', weekday: '周日', city: 'York → Edinburgh', title: '中世纪老城与苏格兰',
    start: '2026-10-04T00:00:00+01:00', end: '2026-10-04T23:59:00+01:00',
    steps: [
      { text: '08:30–11:30 城墙短线 → Shambles → Museum Gardens', location: { name: 'York Museum Gardens', query: 'York Museum Gardens', mode: 'walking' } },
      { text: '12:45–14:15 York Minster；随后取包前往车站', location: { name: 'York Minster', query: 'York Minster', mode: 'walking' } },
      { text: '15:30–16:30 窗口乘 LNER 直达 Edinburgh Waverley', location: { name: 'York Station', query: 'York Railway Station', mode: 'transit' }, trainId: 'yor-edi' },
    ],
    food: [
      { time: '早午餐', name: 'Shambles Kitchen', dish: '烟熏猪肉或牛肉三明治', price: '£10.50–11.90', location: { name: 'Shambles Kitchen', query: 'Shambles Kitchen York', mode: 'walking' } },
      { time: '晚餐', name: 'Oink · Victoria Street', dish: '猪肉卷，可配 haggis stuffing', price: '£6.65–11.95', location: { name: 'Oink Victoria Street', query: 'Oink Victoria Street Edinburgh', mode: 'walking' } },
    ],
    flow: ['step:0', 'meal:0', 'step:1', 'step:2', 'meal:1'],
    wear: '三层穿法：长袖 + 抓绒 + 防风防水外套；北上后会明显更凉。',
    mustDo: 'Minster 后先取包再去 York 站；不要把午餐押在赶车空档。',
    tip: '先吃早午餐再进 Minster，别把吃饭押在赶车空档。',
  },
  {
    date: '10/05', weekday: '周一', city: 'Edinburgh', title: '城堡与 Royal Mile',
    start: '2026-10-05T00:00:00+01:00', end: '2026-10-05T23:59:00+01:00',
    steps: [
      { text: '09:10 到达；09:30–11:45 Edinburgh Castle', location: { name: 'Edinburgh Castle', query: 'Edinburgh Castle', mode: 'walking' } },
      { text: '12:00–15:00 Royal Mile → St Giles’ → Victoria Street', location: { name: 'Victoria Street', query: 'Victoria Street Edinburgh', mode: 'walking' } },
      { text: '15:00–18:00 National Museum；天气好且风小再上 Calton Hill', location: { name: 'Calton Hill', query: 'Calton Hill Edinburgh', mode: 'walking' } },
    ],
    food: [
      { time: '午餐', name: 'Oink', dish: 'Piglet 小份猪肉卷', price: '£6.65', location: { name: 'Oink Victoria Street', query: 'Oink Victoria Street Edinburgh', mode: 'walking' } },
      { time: '晚餐', name: 'MUMS Great Comfort Food', dish: '香肠、土豆泥和肉汁', price: '£15–22', location: { name: 'MUMS Great Comfort Food', query: 'MUMS Great Comfort Food Edinburgh', mode: 'walking' } },
    ],
    flow: ['step:0', 'meal:0', 'step:1', 'step:2', 'meal:1'],
    wear: '三层穿法 + 薄围巾或冷帽；城堡和 Calton Hill 体感更冷。',
    mustDo: '城堡按预约时间入场；下午是否上山以实时风力为准。',
    tip: '城堡和山顶风大，随身带防水外套。',
  },
  {
    date: '10/06', weekday: '周二', city: 'Edinburgh', title: '自然景观与机动日',
    start: '2026-10-06T00:00:00+01:00', end: '2026-10-06T23:59:00+01:00',
    steps: [
      { text: '09:00 看天气；晴天 09:30–12:30 Holyrood Park / Arthur’s Seat', location: { name: 'Arthur’s Seat', query: "Arthur's Seat Edinburgh", mode: 'walking' } },
      { text: '14:00–17:30 Dean Village 或 Stockbridge，只选一个区域', location: { name: 'Dean Village', query: 'Dean Village Edinburgh', mode: 'walking' } },
      { text: '雨天替换：10:00–16:30 National Museum + National Gallery', location: { name: 'National Museum of Scotland', query: 'National Museum of Scotland Edinburgh', mode: 'walking' } },
    ],
    food: [
      { time: '午餐', name: 'Mosque Kitchen', dish: '咖喱饭或烤肉，素食可选', price: '£10–15', location: { name: 'Mosque Kitchen', query: 'Mosque Kitchen Edinburgh', mode: 'walking' } },
      { time: '晚餐', name: '超市 + Hostel', dish: '轻食并整理行李', price: '£6–10', location: { name: 'Edinburgh Waverley 周边超市', query: 'supermarket near Edinburgh Waverley', mode: 'walking' } },
    ],
    flow: ['step:0', 'meal:0', 'step:1', 'step:2', 'meal:1'],
    wear: '速干层 + 抓绒 + 防水外壳 + 抓地鞋；帽子比雨伞更实用。',
    mustDo: '早上先看降雨和风力；大风或路滑就直接改走博物馆雨天线。',
    tip: '06:50 起可办理回程值机；晚上保存两段登机牌。',
  },
  {
    date: '10/07', weekday: '周三', city: 'Edinburgh → HKG', title: '返程日',
    start: '2026-10-07T00:00:00+01:00', end: '2026-10-08T15:20:00+08:00',
    steps: [
      { text: '08:45–09:00 离开市区', location: { name: 'Edinburgh Waverley', query: 'Edinburgh Waverley Station', mode: 'transit' } },
      { text: 'Tram 约 30 分钟，09:45–10:00 到 EDI', location: { name: 'Edinburgh Airport', query: 'Edinburgh Airport', mode: 'transit' } },
      { text: '12:50 起飞；FRA 中转 5 小时 50 分钟', location: { name: 'Frankfurt Airport', query: 'Frankfurt Airport', mode: 'transit' } },
    ],
    food: [
      { time: '早餐', name: 'Hostel / 超市', dish: '面包、水果和咖啡', price: '£5–8', location: { name: 'Edinburgh Waverley 周边超市', query: 'supermarket near Edinburgh Waverley', mode: 'walking' } },
      { time: '机场', name: '登机前补给', dish: '简餐 + 空水瓶过安检', price: '£8–12', location: { name: 'Edinburgh Airport', query: 'Edinburgh Airport', mode: 'transit' } },
    ],
    flow: ['meal:0', 'step:0', 'step:1', 'meal:1', 'step:2'],
    wear: '长袖 + 抓绒 + 外壳，按层穿脱；机舱内保留一件保暖层。',
    mustDo: '09:00 前离开市区；护照、登机牌和充电线放在最容易拿的位置。',
    tip: 'FRA 中转不建议进城；先确认登机口再休息。',
  },
];

function getDayAgenda(day: TripDay) {
  return day.flow.map((entry) => {
    const [kind, rawIndex] = entry.split(':');
    const index = Number(rawIndex);
    if (kind === 'meal') return { kind: 'meal' as const, meal: day.food[index], key: `${day.date}-meal-${index}` };
    return { kind: 'plan' as const, step: day.steps[index], number: index + 1, key: `${day.date}-step-${index}` };
  });
}

function stationNavigationUrl(station: RailStation) {
  return navigationUrl({ name: station.name, query: station.query, mode: 'transit' });
}

function RailLegHint({ trainId }: { trainId?: string }) {
  if (!trainId) return null;
  const train = trainSeed.find((item) => item.id === trainId);
  if (!train) return null;
  return (
    <div className="rail-leg-hint">
      <TrainFront />
      <span>上车：<strong>{train.from.name} ({train.from.code})</strong></span>
      <a href={`#train-${train.id}`}>查看车票与进站说明</a>
    </div>
  );
}

function navigationUrl(place: Place) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.query)}&travelmode=${place.mode}`;
}

function PlaceActions({ place, compact = false, menuHref }: { place: Place; compact?: boolean; menuHref?: string }) {
  return (
    <div className={`place-actions ${compact ? 'is-compact' : ''}`}>
      <span className="place-name"><MapPin />{place.name}</span>
      <a className="navigation-action" href={navigationUrl(place)} target="_blank" rel="noreferrer" aria-label={`在地图查看并导航到 ${place.name}`}><Navigation />地图导航</a>
      {menuHref && <a className="menu-action" href={menuHref} target="_blank" rel="noreferrer" aria-label={`查看 ${place.name} 的菜单或营业信息`}><ForkKnife />菜单</a>}
    </div>
  );
}

const foodLinks = [
  ['Regency Café', 'https://regencycafe.co.uk/menu'],
  ['Borough Market', 'https://boroughmarket.org.uk/visit-us/'],
  ['Shellseekers / Applebee’s Fish', 'https://applebeesfish.com/'],
  ['Roti King', 'https://rotiking.com/location/euston/'],
  ['Master Wei', 'https://master-wei.com/'],
  ['Oxford Covered Market', 'https://oxford-coveredmarket.co.uk/'],
  ['Chaiwalla', 'https://chaiwalla.uk/menu'],
  ['Sally Lunn’s', 'https://www.sallylunns.co.uk/menus/'],
  ['Shambles Kitchen', 'https://www.shambleskitchen.co.uk/'],
  ['Oink', 'https://www.oinkhogroast.co.uk/shops/victoria-street/'],
  ['MUMS Great Comfort Food', 'https://deliveroo.co.uk/menu/edinburgh/old-town-and-canongate/mums-great-comfort-food'],
  ['Mosque Kitchen', 'https://www.mosquekitchen.com/contact-us'],
];

function foodInfoUrl(name: string) {
  return foodLinks.find(([place]) => name.includes(place) || place.includes(name))?.[1];
}

function formatCountdown(target: number, now: number) {
  if (!now) return '—';
  const diff = target - now;
  if (diff <= 0) return '已到时间';
  const daysLeft = Math.floor(diff / 86_400_000);
  const hoursLeft = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutesLeft = Math.floor((diff % 3_600_000) / 60_000);
  const secondsLeft = Math.floor((diff % 60_000) / 1_000);
  if (daysLeft > 0) return `${daysLeft}天 ${hoursLeft}小时`;
  return `${hoursLeft.toString().padStart(2, '0')}:${minutesLeft.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`;
}

function ukTimeToInstant(local: string) {
  return new Date(`${local}:00+01:00`).getTime();
}

function formatCurrentMoment(now: number, timeZone: string) {
  if (!now) return '同步本机时间';
  return new Intl.DateTimeFormat('zh-CN', {
    timeZone,
    month: 'long',
    day: 'numeric',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(now));
}

export default function Home() {
  const [now, setNow] = useState(0);
  const [tasks, setTasks] = useState<Record<string, boolean>>(() => Object.fromEntries(taskSeed.map((task) => [task.id, task.done])));
  const [trains, setTrains] = useState(() => trainSeed);
  const [editingTrain, setEditingTrain] = useState<string | null>(null);
  const [rate, setRate] = useState(9.09);
  const [pounds, setPounds] = useState(80);

  useEffect(() => {
    const initialTick = window.requestAnimationFrame(() => {
      setNow(Date.now());
      try {
        const savedTasks = window.localStorage.getItem('uk-trip-tasks-v1');
        const savedTrains = window.localStorage.getItem('uk-trip-trains-v1');
        if (savedTasks) {
          const previous = JSON.parse(savedTasks) as Record<string, boolean>;
          const migrated: Record<string, boolean> = { ...Object.fromEntries(taskSeed.map((task) => [task.id, task.done])), ...previous };
          if (previous.trains) ['train-lon-oxf', 'train-oxf-bth', 'train-bth-yor', 'train-yor-edi'].forEach((id) => { migrated[id] = true; });
          if (previous.stays) ['stay-london', 'stay-bath', 'stay-york', 'stay-edinburgh'].forEach((id) => { migrated[id] = true; });
          if (previous.attractions) ['tower', 'museum', 'oxford-college', 'roman-baths', 'york-minster', 'edinburgh-castle'].forEach((id) => { migrated[id] = true; });
          setTasks(migrated);
        }
        if (savedTrains) {
          const previousTrains = JSON.parse(savedTrains) as Array<Partial<TrainItem> & { id?: string }>;
          setTrains(trainSeed.map((train) => {
            const saved = previousTrains.find((item) => item.id === train.id);
            return saved?.local ? { ...train, local: saved.local, note: saved.note ?? `票面时间 ${saved.local.slice(11)}` } : train;
          }));
        }
      } catch {
        // A damaged local draft should not stop the live clock or the default itinerary.
      }
    });
    const timer = window.setInterval(() => setNow(Date.now()), 1_000);
    return () => {
      window.cancelAnimationFrame(initialTick);
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    type TripTool = {
      name: string;
      title: string;
      description: string;
      inputSchema: Record<string, unknown>;
      annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
      execute: (input: unknown) => unknown;
    };
    type ModelContext = {
      registerTool: (tool: TripTool, options?: { signal?: AbortSignal }) => void | Promise<void>;
    };
    const context = (document as Document & { modelContext?: ModelContext }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();

    const registrations = [
      context.registerTool({
        name: 'set_trip_task_status',
        title: '更新旅行待办',
        description: '将旅行准备清单中的一个待办标记为完成或未完成。',
        inputSchema: {
          type: 'object',
          properties: {
            taskId: { type: 'string', enum: taskSeed.map((task) => task.id) },
            completed: { type: 'boolean' },
          },
          required: ['taskId', 'completed'],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute(input) {
          const value = input as { taskId?: string; completed?: boolean };
          if (!taskSeed.some((task) => task.id === value.taskId) || typeof value.completed !== 'boolean') {
            throw new Error('无效的待办编号或完成状态');
          }
          setTasks((current) => {
            const next = { ...current, [value.taskId!]: value.completed! };
            window.localStorage.setItem('uk-trip-tasks-v1', JSON.stringify(next));
            return next;
          });
          return { taskId: value.taskId, completed: value.completed };
        },
      }, { signal: lifecycle.signal }),
      context.registerTool({
        name: 'update_train_departure',
        title: '更新列车时间',
        description: '把某段英国火车的暂定出发时间替换为票面当地时间。',
        inputSchema: {
          type: 'object',
          properties: {
            trainId: { type: 'string', enum: trainSeed.map((train) => train.id) },
            localTime: { type: 'string', description: '格式为 YYYY-MM-DDTHH:mm 的英国当地时间' },
          },
          required: ['trainId', 'localTime'],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute(input) {
          const value = input as { trainId?: string; localTime?: string };
          if (!trainSeed.some((train) => train.id === value.trainId) || !/^2026-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value.localTime ?? '')) {
            throw new Error('无效的列车编号或时间格式');
          }
          setTrains((current) => {
            const next = current.map((train) => train.id === value.trainId ? { ...train, local: value.localTime!, note: `票面时间 ${value.localTime!.slice(11)}` } : train);
            window.localStorage.setItem('uk-trip-trains-v1', JSON.stringify(next));
            return next;
          });
          return { trainId: value.trainId, localTime: value.localTime };
        },
      }, { signal: lifecycle.signal }),
    ];
    registrations.forEach((registration) => void Promise.resolve(registration).catch(() => undefined));
    return () => lifecycle.abort();
  }, []);

  const completed = taskSeed.filter((task) => tasks[task.id]).length;
  const taskProgress = Math.round((completed / taskSeed.length) * 100);
  const tripProgress = now ? Math.max(0, Math.min(100, ((now - TRIP_START) / (TRIP_END - TRIP_START)) * 100)) : 0;
  const nextMilestone = useMemo(() => milestones.find((item) => item.time > now) ?? milestones.at(-1)!, [now]);
  const firstTripDayStart = new Date(days[0].start).getTime();
  const activeDayIndex = now ? days.findIndex((day) => now >= new Date(day.start).getTime() && now <= new Date(day.end).getTime()) : -1;
  const activeDay = activeDayIndex >= 0 ? days[activeDayIndex] : null;
  const beforeTrip = !now || now < TRIP_START;
  const outbound = now >= TRIP_START && now < firstTripDayStart;
  const afterTrip = now > TRIP_END;
  const prepStage = prepStages.find((stage) => now < stage.end) ?? prepStages.at(-1)!;
  const stageTasks = prepStage.taskIds.map((id) => taskSeed.find((task) => task.id === id)!).filter((task) => !tasks[task.id]);
  const remainingTasks = taskSeed.filter((task) => !tasks[task.id]);
  const focusTasks = stageTasks.length ? stageTasks : remainingTasks;
  const focusSteps = outbound
    ? ['提前抵达 HKG 并完成安检', '苏黎世转机 55 分钟，跟随转机指示快速前往登机口', '抵达 LHR 后乘 Elizabeth line 进城']
    : afterTrip
      ? ['确认所有消费记录', '整理照片和票据', '完成后续报销或旅行复盘']
      : [];
  const phaseLabel = beforeTrip ? '出发前 · 当前阶段' : outbound ? '旅途中 · 去程航班' : afterTrip ? '旅程结束' : `旅行中 · 第 ${activeDayIndex + 1} 天`;
  const phaseTitle = beforeTrip ? prepStage.title : outbound ? '正在前往伦敦' : afterTrip ? '已经安全回到香港' : activeDay!.title;
  const phaseSummary = beforeTrip ? prepStage.summary : outbound ? '今晚的重点是顺利转机和保留休息时间。' : afterTrip ? '主要行程已经完成，页面会保留全部记录供回看。' : `${activeDay!.city} · ${activeDay!.date} ${activeDay!.weekday}`;
  const currentTimeZone = beforeTrip || afterTrip ? 'Asia/Hong_Kong' : 'Europe/London';
  const activeAgenda = activeDay ? getDayAgenda(activeDay) : [];
  const mealSummary = days.flatMap((day) => day.food.map((meal) => ({
    day,
    meal,
    href: foodInfoUrl(meal.name),
  })));

  function updateTask(id: string, value: boolean) {
    const next = { ...tasks, [id]: value };
    setTasks(next);
    window.localStorage.setItem('uk-trip-tasks-v1', JSON.stringify(next));
  }

  function updateTrain(id: string, local: string) {
    const next = trains.map((train) => train.id === id ? { ...train, local, note: `票面时间 ${local.slice(11)}` } : train);
    setTrains(next);
    window.localStorage.setItem('uk-trip-trains-v1', JSON.stringify(next));
  }

  function resetTrainTimes() {
    setTrains(trainSeed);
    window.localStorage.removeItem('uk-trip-trains-v1');
    setEditingTrain(null);
  }

  return (
    <main>
      <nav className="topbar" aria-label="页面导航">
        <a className="brand" href="#now" aria-label="返回当前安排"><span className="brand-mark">UK</span><span>Tripboard</span></a>
        <div className="nav-links"><a href="#now">现在</a><a href="#todo">待办</a><a href="#packing">穿衣</a><a href="#trains">火车</a><a href="#map">地图</a><a href="#route">行程</a><a href="#money">换汇</a></div>
        <span className="date-chip">9/28–10/08</span>
      </nav>

      <div className="page-shell" id="top">
        <section className={`now-board ${beforeTrip ? 'is-prep' : activeDay ? 'is-travel' : ''}`} id="now" aria-labelledby="now-title">
          <div className="now-summary">
            <p className="live-label"><span aria-hidden="true" />{phaseLabel}</p>
            <p className="now-clock">{formatCurrentMoment(now, currentTimeZone)} · {beforeTrip || afterTrip ? '香港时间' : '英国时间'}</p>
            <h1 id="now-title">{phaseTitle}</h1>
            <p>{phaseSummary}</p>
            {beforeTrip && <span className="stage-range">本阶段 {prepStage.range}</span>}
          </div>

          <article className="now-actions" aria-label="当前要做的事情">
            <div className="now-panel-heading"><span>现在要做</span><strong>{beforeTrip ? `${focusTasks.length} 项待处理` : activeDay ? '今日安排' : '当前安排'}</strong></div>
            {beforeTrip ? (
              focusTasks.length ? <div className="now-task-list">
                {focusTasks.slice(0, 4).map((task, index) => (
                  <div className="now-task-row" key={task.id}>
                    <label className="now-task" htmlFor={`focus-${task.id}`}>
                      <Checkbox id={`focus-${task.id}`} checked={tasks[task.id]} onCheckedChange={(checked) => updateTask(task.id, Boolean(checked))} aria-label={task.label} />
                      <span><b>{index === 0 ? '先做' : `接着 ${index + 1}`}</b><strong>{task.label}</strong><small>{task.detail ?? task.group}</small></span>
                    </label>
                    {task.href && <a className="now-task-action" href={task.href} target="_blank" rel="noreferrer">{task.action ?? '打开'} <ExternalLink /></a>}
                  </div>
                ))}
              </div> : <div className="focus-complete"><CheckCircle2 /><strong>出发前清单已经全部完成</strong><span>可以安心等待值机开放。</span></div>
            ) : activeDay ? (
              <>
                <div className="now-wear"><Shirt /><span><b>今天这样穿</b>{activeDay.wear}</span></div>
                <div className="now-agenda">
                  {activeAgenda.map((entry) => entry.kind === 'meal' ? (
                    <div className="now-agenda-item is-meal" key={entry.key}>
                      <span>{entry.meal.time}</span><div><strong>{entry.meal.name}</strong><small>{entry.meal.dish}</small><PlaceActions place={entry.meal.location} menuHref={foodInfoUrl(entry.meal.name)} compact /></div><b>{entry.meal.price}</b>
                    </div>
                  ) : (
                    <div className="now-agenda-item" key={entry.key}>
                      <span>{entry.number}</span><div><strong>{entry.step.text}</strong><PlaceActions place={entry.step.location} compact /><RailLegHint trainId={entry.step.trainId} /></div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <ol className="now-step-list">{focusSteps.map((step) => <li key={step}>{step}</li>)}</ol>
            )}
            <a className="now-link" href={beforeTrip ? '#todo' : '#route'}>{beforeTrip ? '查看完整准备清单' : '查看完整行程'} <ChevronRight /></a>
          </article>

          <aside className="now-next" aria-label="下一时间节点">
            <p className="now-panel-heading"><span>紧接着</span><Clock3 /></p>
            <p className="next-countdown">{formatCountdown(nextMilestone.time, now)}</p>
            <h2>{nextMilestone.label}</h2>
            <p>{nextMilestone.note}</p>
          </aside>
        </section>

        <section className="hero-grid" aria-labelledby="trip-title">
          <div className="hero-copy">
            <p className="eyebrow"><Plane aria-hidden="true" /> 已确认 · Economy Light</p>
            <h2 id="trip-title">九天穿过<br />英格兰与苏格兰</h2>
            <p className="route-line">Hong Kong <ArrowRight /> London <ArrowRight /> Edinburgh</p>
            <div className="hero-actions"><a className="primary-action" href="#now">返回当前安排 <ChevronRight /></a><a className="secondary-action" href="#map">打开行程地图</a></div>
          </div>
          <figure className="hero-photo" aria-label="Edinburgh 城堡与城市天际线">
            <div className="photo-overlay"><span className="photo-city">Edinburgh</span><span className="photo-note">最后三晚 · 10/04–10/07</span></div>
            <a className="photo-credit" href="https://unsplash.com/photos/a-city-with-a-castle-in-the-distance-H4S5hK3B-NQ" target="_blank" rel="noreferrer">Photo: Natalie Parham / Unsplash</a>
          </figure>
        </section>

        <section className="status-grid" id="today" aria-label="旅行状态">
          <article className="status-card status-primary">
            <div className="card-kicker"><Clock3 /> 下一节点</div>
            <p className="countdown-big">{formatCountdown(nextMilestone.time, now)}</p>
            <h2>{nextMilestone.label}</h2><p>{nextMilestone.note}</p>
          </article>
          <article className="status-card">
            <div className="card-kicker"><CalendarDays /> 全程进度</div>
            <Progress value={tripProgress} className="trip-progress"><ProgressLabel>{now < TRIP_START ? '出发前准备' : now > TRIP_END ? '旅程完成' : '旅行进行中'}</ProgressLabel><ProgressValue>{Math.round(tripProgress)}%</ProgressValue></Progress>
            <p className="stat-detail">09/28 23:05 HKG 起飞</p><p className="stat-detail">10/08 15:20 HKG 抵达</p>
          </article>
          <article className="status-card ticket-card">
            <div className="card-kicker"><Plane /> 国际航班</div>
            <div className="ticket-route"><strong>HKG</strong><span>经 ZRH</span><strong>LHR</strong></div>
            <div className="ticket-route"><strong>EDI</strong><span>经 FRA</span><strong>HKG</strong></div>
            <p className="stat-detail">SWISS 去程 · Lufthansa 回程</p>
          </article>
        </section>

        <section className="section" id="todo">
          <div className="section-heading"><div><p className="eyebrow"><CheckCircle2 /> 出发前控制台</p><h2>下一步做什么</h2></div><span className="section-metric">{completed}/{taskSeed.length} 完成</span></div>
          <div className="todo-layout">
            <article className="panel todo-panel">
              <Progress value={taskProgress} className="todo-progress"><ProgressLabel>准备进度</ProgressLabel><ProgressValue>{taskProgress}%</ProgressValue></Progress>
              <div className="todo-sections">
                {taskSections.map((section) => (
                  <section className="task-section" key={section.title}>
                    <h3>{section.title}</h3>
                    <div className="todo-list">
                      {section.ids.map((id) => taskSeed.find((task) => task.id === id)!).map((task) => (
                        <div className={`todo-row ${tasks[task.id] ? 'is-done' : ''}`} key={task.id}>
                          <Checkbox id={`task-${task.id}`} checked={tasks[task.id]} onCheckedChange={(checked) => updateTask(task.id, Boolean(checked))} aria-label={task.label} />
                          <label className="todo-copy" htmlFor={`task-${task.id}`}><span className="todo-label">{task.label}</span>{task.detail && <small>{task.detail}</small>}</label>
                          <span className="todo-group">{task.group}</span>
                          {task.href && <a className="task-action" href={task.href} target="_blank" rel="noreferrer">{task.action ?? '打开'} <ExternalLink /></a>}
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </article>
            <aside className="priority-stack">
              <article className="priority-card urgent"><span>优先级 01</span><h3>四段火车逐段购买</h3><p>先锁定 10/02 的两段车，再买 Bath → York 和 York → Edinburgh；不要把 Oxford 停留误当作可随意中断的一张通票。</p><a href="#trains">查看购票入口与上车站</a></article>
              <article className="priority-card"><span>优先级 02</span><h3>四地住宿逐笔确认</h3><p>确认地址、入住时间、退房后寄存与储物柜；预订完成后把地址加进手机地图。</p></article>
              <article className="priority-card"><span>优先级 03</span><h3>六项景点分别预约</h3><p>以固定时间为锚点，再围绕它安排吃饭和步行，不把整天排成连续赶场。</p></article>
              <article className="priority-card dark-card"><span>值机提醒</span><h3>9/27 23:05 后尝试</h3><p>SWISS 去程值机；准备护照和六位预订编号。</p></article>
            </aside>
          </div>
        </section>

        <section className="section packing-section" id="packing">
          <div className="section-heading"><div><p className="eyebrow"><Shirt /> Light packing</p><h2>两个背包怎么装</h2></div><span className="section-metric">约 7–19°C · 防风雨优先</span></div>
          <p className="section-intro">不按九天准备九套衣服。采用“贴身层 + 保暖层 + 防风雨外层”，中途洗一次；每天具体穿法已经放进下方逐日行程。</p>
          <div className="packing-weather">
            <div><CloudRain /><span><b>London</b>常年参考约 10–19°C，室内和地铁较暖，外套要方便脱。</span></div>
            <div><Wind /><span><b>Edinburgh</b>常年参考约 7–17°C，城堡和山顶风大，体感会更低。</span></div>
            <a href="https://weather.metoffice.gov.uk/" target="_blank" rel="noreferrer">9/22 后查看逐日天气 <ExternalLink /></a>
          </div>
          <div className="packing-grid">
            <article><Umbrella /><h3>外层</h3><strong>防风防水连帽外套 ×1</strong><p>每天随身。比雨伞更适合 Edinburgh 的风。</p></article>
            <article><Shirt /><h3>保暖与上衣</h3><strong>抓绒/薄毛衣 ×1，上衣 3–4 件</strong><p>怕冷再带可压缩薄羽绒；不带厚重大衣。</p></article>
            <article><Footprints /><h3>下装与鞋袜</h3><strong>长裤 ×2，内衣袜各 4 套</strong><p>只带一双防滑、耐走、略防水的鞋。</p></article>
            <article><Luggage /><h3>背包分工</h3><strong>主包放衣物，小包放证件与当天用品</strong><p>防水外套、充电线、护照和电子票放最容易拿的位置。</p></article>
          </div>
        </section>

        <section className="section map-section" id="map">
          <div className="section-heading"><div><p className="eyebrow"><MapPinned /> Route map</p><h2>五城位置与移动方向</h2></div><span className="section-metric">约 860 km 向北</span></div>
          <p className="section-intro">编号就是旅行顺序。红色虚线是城市间方向示意；实际列车线路和站台以车票为准。地图支持拖动、缩放和点击标记。</p>
          <RouteMap />
        </section>

        <section className="section" id="trains">
          <div className="section-heading"><div><p className="eyebrow"><TrainFront /> Rail desk</p><h2>从购票到上车</h2></div><Button variant="ghost" onClick={resetTrainTimes}><RotateCcw /> 恢复暂定时间</Button></div>
          <p className="section-intro">先用 National Rail Journey Planner 查全部车次和票种，选择后会转到铁路公司完成付款；也可以直接在对应运营商官网购买。买完后把下面的暂定时间改成票面时间。</p>
          <article className="rail-buy-guide">
            <div className="rail-buy-title"><TicketCheck /><div><span>推荐购买顺序</span><strong>四段分别搜索，四张电子票分别保存</strong></div></div>
            <ol>
              <li><b>1</b><span>按页面给出的日期与窗口搜索，只买对应起点和终点。</span></li>
              <li><b>2</b><span>便宜的 Advance 票通常绑定具体班次；确认换乘时间和退改规则再付款。</span></li>
              <li><b>3</b><span>选择 eTicket，保存二维码、Coach / Seat；当天再看实时站台。</span></li>
            </ol>
            <a href="https://www.nationalrail.co.uk/journey-planner/" target="_blank" rel="noreferrer">打开 National Rail <ExternalLink /></a>
          </article>
          <div className="rail-platform-note"><CircleAlert /><p><strong>站台号不能提前写死。</strong>英国车站会在临近发车时公布或调整站台；到站后按票面时间和终点找大屏，听广播，并用每张卡片里的“当天看站台”。</p></div>
          <div className="train-grid">
            {trains.map((train, index) => (
              <article className="train-card" id={`train-${train.id}`} key={train.id}>
                <div className="train-index">0{index + 1}</div>
                <div className="train-card-top">
                  <div className="train-meta"><span>{train.date}</span><span>{train.note}</span><span>{train.operator}</span></div>
                  <label className="ticket-status" htmlFor={`ticket-${train.id}`}><Checkbox id={`ticket-${train.id}`} checked={tasks[train.taskId]} onCheckedChange={(checked) => updateTask(train.taskId, Boolean(checked))} /><span>{tasks[train.taskId] ? '已购票' : '待购买'}</span></label>
                </div>
                <h3>{train.route}</h3>
                <div className="station-flow">
                  <div className="station-box"><span>在这里上车</span><strong>{train.from.name} <b>{train.from.code}</b></strong><small>{train.from.address}</small><a href={stationNavigationUrl(train.from)} target="_blank" rel="noreferrer"><Navigation />导航到车站</a></div>
                  <ArrowRight aria-hidden="true" />
                  <div className="station-box"><span>在这里下车</span><strong>{train.to.name} <b>{train.to.code}</b></strong><small>{train.to.address}</small></div>
                </div>
                <div className="train-instructions"><p><TrainFront />{train.routePlan}</p><p><Clock3 />{train.arrive}</p></div>
                <div className="train-timing"><span>距暂定发车</span><strong>{formatCountdown(ukTimeToInstant(train.local), now)}</strong></div>
                <div className="train-actions"><a className="buy-train" href={train.bookingUrl} target="_blank" rel="noreferrer"><TicketCheck />搜索并购票</a><a href={train.operatorUrl} target="_blank" rel="noreferrer">{train.operator} 官网 <ExternalLink /></a><a href={train.liveUrl} target="_blank" rel="noreferrer"><Clock3 />当天看站台</a></div>
                {editingTrain === train.id ? (
                  <div className="train-editor"><label htmlFor={`time-${train.id}`}>英国当地日期和时间</label><input id={`time-${train.id}`} type="datetime-local" value={train.local} onChange={(event) => updateTrain(train.id, event.target.value)} /><Button size="sm" onClick={() => setEditingTrain(null)}>保存</Button></div>
                ) : <Button className="train-time-button" size="sm" variant="outline" onClick={() => setEditingTrain(train.id)}><Pencil /> 改成票面时间</Button>}
              </article>
            ))}
          </div>
          <p className="source-note">铁路说明在 2026-09-09 按 National Rail、GWR、CrossCountry 与 LNER 官方信息核对；实际车次、价格、换乘站和站台以购票页与出发当天信息为准。</p>
        </section>

        <section className="section route-section" id="route">
          <div className="section-heading"><div><p className="eyebrow"><MapPin /> 逐日执行</p><h2>一路向北</h2></div><span className="section-metric">8 晚 · 5 城</span></div>
          <p className="section-intro">点“地图导航”即可查看地点，并以你当时的位置为起点；跨城移动默认使用公共交通。</p>
          <div className="timeline">
            {days.map((day, index) => {
              const start = new Date(day.start).getTime();
              const end = new Date(day.end).getTime();
              const state = now >= start && now <= end ? 'current' : now > end ? 'past' : 'future';
              return (
                <article className={`day-card ${state}`} key={day.date}>
                  <div className="day-rail" aria-hidden="true"><span>{index + 1}</span></div>
                  <div className="day-body">
                    <header className="day-header"><div><p className="day-date">{day.date} · {day.weekday} · {day.city}</p><h3>{day.title}</h3></div><span className={`state-badge ${state}`}>{state === 'current' ? '今天' : state === 'past' ? '完成' : '计划'}</span></header>
                    <div className="day-practical">
                      <div><Shirt /><span><b>今天怎么穿</b>{day.wear}</span></div>
                      <div><CircleAlert /><span><b>今天别忘了</b>{day.mustDo}</span></div>
                    </div>
                    <div className="day-agenda">
                      {getDayAgenda(day).map((entry) => entry.kind === 'meal' ? (
                        <div className="agenda-row meal-row" key={entry.key}>
                          <span className="agenda-marker"><ForkKnife /></span><span className="agenda-type">{entry.meal.time}</span><div><strong>{entry.meal.name}</strong><small>{entry.meal.dish}</small><PlaceActions place={entry.meal.location} menuHref={foodInfoUrl(entry.meal.name)} /></div><b>{entry.meal.price}</b>
                        </div>
                      ) : (
                        <div className="agenda-row" key={entry.key}>
                          <span className="agenda-marker">{entry.number}</span><span className="agenda-type">行程</span><div><strong>{entry.step.text}</strong><PlaceActions place={entry.step.location} /><RailLegHint trainId={entry.step.trainId} /></div>
                        </div>
                      ))}
                    </div>
                    <p className="day-tip"><Umbrella /> {day.tip}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="section money-section" id="money">
          <div className="section-heading light-heading"><div><p className="eyebrow"><Coins /> GBP pocket plan</p><h2>不用换很多现金</h2></div><span className="rate-pill">参考汇率 £1 ≈ ¥{rate.toFixed(2)}</span></div>
          <div className="money-grid">
            <article className="cash-answer"><p className="cash-label">建议兑换现金</p><p className="cash-number">£80</p><p>约 ¥{Math.round(80 * rate)}。准备 £5、£10、£20 小面额即可；其余使用免境外手续费的 Visa / Mastercard。</p><div className="cash-split"><span>现金应急 <strong>£80</strong></span><span>卡内可用额度 <strong>£600+</strong></span></div></article>
            <article className="budget-card"><h3><WalletCards /> 还没预付时的预算</h3><div className="budget-row"><span>餐饮（9天）</span><strong>£270–320</strong></div><div className="budget-row"><span>市内交通</span><strong>£60–90</strong></div><div className="budget-row"><span>景点</span><strong>£110–150</strong></div><div className="budget-row"><span>杂费与机动</span><strong>£60–100</strong></div><div className="budget-total"><span>旅行中可变支出</span><strong>£500–660</strong></div></article>
            <article className="converter-card"><h3>快速换算</h3><label htmlFor="pounds">英镑金额</label><div className="money-input"><span>£</span><input id="pounds" type="number" min="0" value={pounds} onChange={(event) => setPounds(Number(event.target.value))} /></div><label htmlFor="rate">GBP/CNY 参考汇率</label><div className="money-input"><span>¥</span><input id="rate" type="number" min="0" step="0.01" value={rate} onChange={(event) => setRate(Number(event.target.value))} /></div><p className="converted">≈ ¥{Math.round(pounds * rate).toLocaleString('zh-CN')}</p><small>网页内置值为 2026-09-08 中间价约 9.09；实际换汇含点差和手续费。</small></article>
          </div>
        </section>

        <section className="section food-sources" aria-labelledby="food-title">
          <div className="section-heading"><div><p className="eyebrow"><ForkKnife /> 每日菜单汇总</p><h2 id="food-title">吃什么，一页查完</h2></div><span className="section-metric">{mealSummary.length} 餐建议</span></div>
          <div className="meal-summary-grid">{mealSummary.map(({ day, meal, href }) => (
            <article className="meal-summary-card" key={`${day.date}-${meal.name}`}>
              <div className="meal-summary-meta"><span>{day.date} · {day.city} · {meal.time}</span><b>{meal.price}</b></div>
              <h3>{meal.name}</h3><p>{meal.dish}</p>
              <PlaceActions place={meal.location} menuHref={href} compact />
            </article>
          ))}</div>
          <p className="source-note">价格和营业时间在 2026-09-08 核对；旅行当天仍以店铺公告为准。London 交通请全程使用同一张卡或同一台手机触碰闸机，以正确计算每日封顶。</p>
        </section>

        <footer><div><span className="brand-mark">UK</span><strong>Tripboard 2026</strong></div><p>轻装、顺路、留一点余地。</p></footer>
      </div>
    </main>
  );
}
