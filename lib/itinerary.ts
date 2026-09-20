export type Place = { name: string; query: string; mode: string };
export type DayStep = { text: string; location: Place; trainId?: string };
export type DayMeal = { time: string; name: string; dish: string; price: string; location: Place };
export type TripDay = {
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

// Meal amounts are planning allowances per person, not verified menu prices.
export const days: TripDay[] = [
  {
    date: '09/29', weekday: '周二', city: 'London', title: '抵达伦敦 · 河岸与塔桥',
    start: '2026-09-29T07:55:00+01:00', end: '2026-09-29T23:59:59.999+01:00',
    steps: [
      { text: '07:55 抵达 Heathrow；入境后乘 Piccadilly line 到 Earl’s Court，再步行到 Barmy Badger。早到寄存与入住时间以青旅确认安排为准。', location: { name: 'Barmy Badger Backpackers', query: 'Barmy Badger Backpackers 17 Longridge Road London', mode: 'transit' } },
      { text: '下午只走 London Bridge 南岸一小段：Hay’s Galleria → 河岸步道 → Tower Bridge；累了就先回住宿休息。', location: { name: 'Tower Bridge 南岸', query: 'Potters Fields Park London', mode: 'walking' } },
      { text: '饭后若精神还好，在塔桥附近看夜景后回住宿；不安排必须准时入场的景点。', location: { name: 'Tower Bridge', query: 'Tower Bridge London', mode: 'walking' } },
    ],
    food: [
      { time: '午餐', name: 'Borough Market', dish: '在市场选热食或三明治；周二通常 10:00–17:00，落地延误就就近吃。', price: '预算 £12–20/人', location: { name: 'Borough Market', query: 'Borough Market 8 Southwark Street London', mode: 'transit' } },
      { time: '晚餐', name: 'Honest Burgers · London Bridge', dish: '汉堡配薯条，也有素食选择；在 London Bridge 与塔桥步行范围内。', price: '预算 £18–28/人', location: { name: 'Honest Burgers London Bridge', query: 'Honest Burgers London Bridge 6 Bermondsey Street', mode: 'walking' } },
    ],
    flow: ['step:0', 'meal:0', 'step:1', 'meal:1', 'step:2'],
    wear: '薄长袖 + 可收纳保暖层 + 防风防水外套；河边看夜景时加一层。',
    mustDo: 'Barmy Badger 已订 5 晚，9/29 入住、10/4 退房；寄存行李和入住时间待核对订单详情。',
    tip: '今天以恢复精神为主；南岸只走塔桥附近，不从 Westminster 一路走到底。',
  },
  {
    date: '09/30', weekday: '周三', city: 'London', title: '西区经典 · 王宫与威斯敏斯特',
    start: '2026-09-30T00:00:00+01:00', end: '2026-09-30T23:59:59.999+01:00',
    steps: [
      { text: '上午看 Buckingham Palace 外观，经 St James’s Park 步行到 Westminster。换岗仅在官方日历确认后加入。', location: { name: 'Buckingham Palace', query: 'Buckingham Palace London', mode: 'transit' } },
      { text: '午后看大本钟与议会广场；想入内参观 Westminster Abbey，就预约下午较早时段并留约 2 小时。', location: { name: 'Westminster Abbey', query: 'Westminster Abbey London', mode: 'walking' } },
      { text: '傍晚往 Trafalgar Square、Chinatown 慢慢走；体力不足就乘地铁或直接回住宿。', location: { name: 'Trafalgar Square', query: 'Trafalgar Square London', mode: 'walking' } },
    ],
    food: [
      { time: '午餐', name: 'Westminster Arms', dish: '英式派或炸鱼薯条；就在教堂附近，周一至周六厨房通常 11:30–20:00。', price: '预算 £20–30/人', location: { name: 'Westminster Arms', query: 'Westminster Arms 9 10 Storeys Gate London', mode: 'walking' } },
      { time: '晚餐', name: 'Dumplings’ Legend · Chinatown', dish: '小笼包配主食，按食量点；18:00 左右吃饭后结束当天行程。', price: '预算 £18–30/人', location: { name: 'Dumplings’ Legend', query: 'Dumplings Legend 15 16 Gerrard Street London', mode: 'walking' } },
    ],
    flow: ['step:0', 'meal:0', 'step:1', 'step:2', 'meal:1'],
    wear: '长袖 + 轻保暖层 + 防水外套；公园和河边比室内凉，穿耐走鞋。',
    mustDo: '教堂是否入内自行取舍；预约后以门票时间为准，不再加伦敦眼和另一所大型博物馆。',
    tip: '没有换岗也照常逛王宫和公园；不要按“单数日一定有”安排行程。',
  },
  {
    date: '10/01', weekday: '周四', city: 'London ↔ Cambridge', title: '剑桥一日游 · 学院与康河',
    start: '2026-10-01T00:00:00+01:00', end: '2026-10-01T23:59:59.999+01:00',
    steps: [
      { text: '从 Barmy Badger 经 Earl’s Court 乘 Piccadilly line 到 King’s Cross，再乘快车到 Cambridge；站到老城再留约 25–30 分钟步行，或现场选公交。', location: { name: 'London King’s Cross', query: 'London Kings Cross Station', mode: 'transit' }, trainId: 'lon-cbg' },
      { text: '到城里后先逛 King’s Parade；只选 King’s College Chapel 一所学院入内，按可订时段调整上午顺序。', location: { name: 'King’s College Chapel', query: 'Kings College Chapel Cambridge', mode: 'walking' } },
      { text: '午后参加有人掌篙的康河游船，或在 The Backs 河畔散步；再看 Trinity Street 一带，不逐个赶学院。', location: { name: '康河 · Mill Lane', query: 'Mill Lane Punting Station Cambridge', mode: 'walking' } },
      { text: '早晚餐后回 Cambridge 站；若选择 18:00 左右的车，建议 17:00 离开老城、17:30 前到站。具体仍以车票为准。', location: { name: 'Cambridge Station', query: 'Cambridge Railway Station Station Road', mode: 'transit' }, trainId: 'cbg-lon' },
    ],
    food: [
      { time: '午餐', name: 'Cambridge Market', dish: 'Market Square 选街头热食；市场通常每日 10:00–16:00，摊位以当天为准。', price: '预算 £10–18/人', location: { name: 'Cambridge Market Square', query: 'Cambridge Market Square Market Hill', mode: 'walking' } },
      { time: '早晚餐', name: 'The Eagle · Cambridge', dish: '建议 16:15–17:00 吃英式酒吧餐；周四厨房通常到 22:00，赶车时不等长队。', price: '预算 £20–30/人', location: { name: 'The Eagle', query: 'The Eagle Benet Street Cambridge', mode: 'walking' } },
    ],
    flow: ['step:0', 'step:1', 'meal:0', 'step:2', 'meal:1', 'step:3'],
    wear: '长袖 + 防风外套；撑篙坐着容易冷，把抓绒放进小背包。',
    mustDo: '大件行李留伦敦；目的站是 Cambridge，不是 Cambridge North。往返车次和礼拜堂时段均待预订。',
    tip: '从 Barmy Badger 到剑桥老城单程按约 2–2.5 小时规划，含地铁、候车与步行；全天往返约 4–5 小时。雨大时取消撑篙。',
  },
  {
    date: '10/02', weekday: '周五', city: 'London', title: '大英博物馆 · 西区慢逛',
    start: '2026-10-02T00:00:00+01:00', end: '2026-10-02T23:59:59.999+01:00',
    steps: [
      { text: '上午预约 British Museum 免费入场，建议从 10:00 左右开始，集中看埃及、希腊等 2–3 个主题。', location: { name: 'British Museum', query: 'British Museum Great Russell Street London', mode: 'transit' } },
      { text: '下午走 Covent Garden → Seven Dials；留咖啡、商店和休息时间，不再塞圣保罗或另一家大馆。', location: { name: 'Covent Garden', query: 'Covent Garden London', mode: 'walking' } },
      { text: '晚饭后回住宿，买好明天白崖的水和便携午餐；再核对天气、铁路和沿海巴士。', location: { name: 'Covent Garden 周边超市', query: 'supermarket near Covent Garden London', mode: 'walking' } },
    ],
    food: [
      { time: '午餐', name: 'Master Wei · Bloomsbury', dish: '博物馆附近吃 biangbiang 面；官网确认 Bloomsbury 门店，具体营业时段当天再看。', price: '预算 £16–25/人', location: { name: 'Master Wei Bloomsbury', query: 'Master Wei 13 Cosmo Place Bloomsbury London', mode: 'walking' } },
      { time: '晚餐', name: 'Seven Dials Market', dish: '室内美食市场选主食；周五场馆通常 11:00–23:00，各厨房收餐时间可能不同。', price: '预算 £15–25/人', location: { name: 'Seven Dials Market', query: 'Seven Dials Market Earlham Street London', mode: 'walking' } },
    ],
    flow: ['step:0', 'meal:0', 'step:1', 'meal:1', 'step:2'],
    wear: '长袖 + 易穿脱外套；室内较暖，背小包方便安检。',
    mustDo: '博物馆与白崖可按天气对调，但先检查已订门票、车票的日期和改签条件。',
    tip: '明天是完整的一日往返；今晚不安排太晚的活动，把防水外套和步行鞋准备好。',
  },
  {
    date: '10/03', weekday: '周六', city: 'London ↔ Seven Sisters', title: '七姐妹白崖 · 西岸观景短线',
    start: '2026-10-03T00:00:00+01:00', end: '2026-10-03T23:59:59.999+01:00',
    steps: [
      { text: '若选择 08:00 左右火车，约 07:00 离开 Barmy Badger；经 Earl’s Court 乘 District line 到 Victoria，再经 Lewes 换乘到 Seaford。时间按实际车次调整。', location: { name: 'London Victoria', query: 'London Victoria Station', mode: 'transit' }, trainId: 'lon-sea' },
      { text: '到 Seaford 后步行至 Seaford Library，乘 12 路往 Eastbourne 方向，到 Seven Sisters Park Centre（Exceat）下车；不要上终到 Seaford 的车。', location: { name: 'Seven Sisters Park Centre', query: 'Seven Sisters Country Park Visitor Centre Exceat', mode: 'transit' } },
      { text: '午餐后经 Exceat Bridge 走到 Cuckmere 河西岸，往 Coastguard Cottages 看白崖；原路返回，全段加拍照休息留约 2–3 小时。', location: { name: 'Coastguard Cottages · Cuckmere Haven', query: 'Coastguard Cottages Cuckmere Haven Seaford', mode: 'walking' } },
      { text: '下午回 Park Centre 公交站，乘往 Brighton 方向的巴士回 Seaford；再经 Lewes 返回 London Victoria。', location: { name: 'Seaford Station', query: 'Seaford Railway Station East Sussex', mode: 'transit' }, trainId: 'sea-lon' },
    ],
    food: [
      { time: '午餐', name: '自带野餐 · Exceat', dish: '前一晚在伦敦买好三明治、水果和水；到访客中心附近先吃，不依赖海岸咖啡店营业。', price: '预算 £7–12/人', location: { name: 'Seven Sisters Visitor Centre', query: 'Seven Sisters Country Park Visitor Centre Exceat', mode: 'walking' } },
      { time: '晚餐', name: 'Market Halls · Victoria', dish: '回伦敦后在车站附近吃热食；周六场馆通常到 23:00，先看各厨房是否仍接单。', price: '预算 £15–25/人', location: { name: 'Market Halls Victoria', query: 'Market Halls 191 Victoria Street London', mode: 'walking' } },
    ],
    flow: ['step:0', 'step:1', 'meal:0', 'step:2', 'step:3', 'meal:1'],
    wear: '防风防水连帽外套 + 保暖层 + 防滑步行鞋；带水和充电宝，海岸大风时不用伞。',
    mustDo: '出发前核对天气与回程公交；不涉水横渡 Cuckmere 河口，不靠崖边。大风、暴雨就改留伦敦。',
    tip: '这次只走西岸小屋短线，不走到 Birling Gap。门到门交通含巴士候车按约 5–6 小时留量，另加步行拍照。',
  },
  {
    date: '10/04', weekday: '周日', city: 'London → Edinburgh', title: '北上爱丁堡 · 留足交通时间',
    start: '2026-10-04T00:00:00+01:00', end: '2026-10-04T23:59:59.999+01:00',
    steps: [
      { text: '上午从 Barmy Badger 退房，带齐行李；经 Earl’s Court 乘 Piccadilly line 到 King’s Cross；建议发车前 30 分钟进入车站，今天不排 Greenwich 等跨城景点。', location: { name: 'London King’s Cross', query: 'London Kings Cross Station', mode: 'transit' } },
      { text: '按购票后确认的班次乘 LNER 列车去 Edinburgh Waverley。当天 Newcastle 一带施工，部分服务经 Carlisle 绕行，不能按平日 4.5 小时预计。', location: { name: 'London King’s Cross', query: 'London Kings Cross Station', mode: 'transit' }, trainId: 'lon-edi' },
      { text: '抵达 Waverley 后步行到 Castle Rock Hostel 入住，最后一段有上坡。晚间只在老城附近散步，不固定安排日落登山。', location: { name: 'Castle Rock Hostel', query: 'Castle Rock Hostel 15 Johnston Terrace Edinburgh EH1 2PW', mode: 'walking' } },
    ],
    food: [
      { time: '上车前补给', name: 'King’s Cross · 列车餐', dish: '在车站买三明治、水果和饮用水带上车作午餐；不要依赖车上餐饮供应。', price: '预算 £8–15/人', location: { name: 'King’s Cross 车站商店', query: 'London Kings Cross Station food shops', mode: 'walking' } },
      { time: '晚餐', name: 'The Booking Office · Edinburgh', dish: 'Waverley Bridge 旁吃酒吧简餐；酒吧营业晚于厨房，抵达后先确认是否仍供餐。', price: '预算 £15–25/人', location: { name: 'The Booking Office', query: 'The Booking Office 17 Waverley Bridge Edinburgh', mode: 'walking' } },
    ],
    flow: ['step:0', 'meal:0', 'step:1', 'step:2', 'meal:1'],
    wear: '长袖 + 抓绒 + 防风防水外套；保暖层和充电线放随身小包。',
    mustDo: 'Castle Rock 已订 3 晚，10/4 入住、10/7 退房；买票前核对工程后的路线、抵达时间与青旅晚到入住安排。',
    tip: '工程日把全天留给北上，不锁定傍晚门票或用餐预约；也不再承诺右侧海景。',
  },
  {
    date: '10/05', weekday: '周一', city: 'Edinburgh', title: '城堡 · 皇家英里与维多利亚街',
    start: '2026-10-05T00:00:00+01:00', end: '2026-10-05T23:59:59.999+01:00',
    steps: [
      { text: '上午按预约时间参观 Edinburgh Castle，建议留 2–3 小时，结束后顺坡走入老城。', location: { name: 'Edinburgh Castle', query: 'Edinburgh Castle', mode: 'walking' } },
      { text: '午后逛 Victoria Street 与 Grassmarket，再回到 Royal Mile、St Giles’ Cathedral 一带；教堂入内按当天开放安排。', location: { name: 'Victoria Street', query: 'Victoria Street Edinburgh', mode: 'walking' } },
      { text: '下午继续老城小巷或坐咖啡馆休息；想看 Mary King’s Close，可用它替换这段闲逛并提前预约。', location: { name: 'Royal Mile', query: 'Royal Mile Edinburgh', mode: 'walking' } },
    ],
    food: [
      { time: '午餐', name: 'Oink · Victoria Street', dish: '烤猪肉卷；通常 11:00–17:00 或售完即止，只作为午餐选项，售完就在附近换一家。', price: '预算 £10–16/人', location: { name: 'Oink Victoria Street', query: 'Oink 34 Victoria Street Edinburgh', mode: 'walking' } },
      { time: '晚餐', name: 'Makars Mash Bar · The Mound', dish: '肉类或蘑菇配土豆泥；建议 18:00 左右，最后点餐通常 20:30，热门时段可预约。', price: '预算 £25–38/人', location: { name: 'Makars Mash Bar', query: 'Makars Mash Bar 9 12 Bank Street Edinburgh', mode: 'walking' } },
    ],
    flow: ['step:0', 'meal:0', 'step:1', 'step:2', 'meal:1'],
    wear: '长袖 + 保暖层 + 防风外套；城堡风大，石板路需要防滑鞋。',
    mustDo: '提前预订城堡入场；Mary King’s Close 是可选替换项，不和其他付费导览一起塞满。',
    tip: 'Oink 不适合安排夜晚；Makars 现场等位可能较久，不愿排队就选老城附近其他热食。',
  },
  {
    date: '10/06', weekday: '周二', city: 'Edinburgh', title: '亚瑟王座 · 苏格兰国家博物馆',
    start: '2026-10-06T00:00:00+01:00', end: '2026-10-06T23:59:59.999+01:00',
    steps: [
      { text: '上午天气合适就走 Holyrood Park / Arthur’s Seat，步行与休息留 2–3 小时；遇大风或路滑，改从 10:00 起逛国家博物馆。', location: { name: 'Holyrood Park · Arthur’s Seat', query: 'Holyrood Park Edinburgh', mode: 'walking' } },
      { text: '午餐后逛 National Museum of Scotland，通常 17:00 闭馆；若上午已因雨入馆，下午继续选喜欢的展厅即可。', location: { name: 'National Museum of Scotland', query: 'National Museum of Scotland Chambers Street Edinburgh', mode: 'walking' } },
      { text: '傍晚按体力在 Princes Street Gardens 周边短走或直接回住宿；整理行李、保存返程登机资料。', location: { name: 'Princes Street Gardens', query: 'Princes Street Gardens Edinburgh', mode: 'walking' } },
    ],
    food: [
      { time: '午餐', name: 'Museum Kitchen · National Museum', dish: '馆内 Level 0 吃热食、披萨或三明治；通常 10:00–17:00，最后点餐 16:45。', price: '预算 £12–22/人', location: { name: 'Museum Kitchen', query: 'Museum Kitchen National Museum of Scotland Chambers Street', mode: 'walking' } },
      { time: '晚餐', name: '住宿附近 · 超市轻食', dish: '买沙拉、三明治或热食回住宿；需要加热的食物先确认住宿有厨房。', price: '预算 £8–14/人', location: { name: 'Waverley 周边超市', query: 'supermarket near Edinburgh Waverley Station', mode: 'walking' } },
    ],
    flow: ['step:0', 'meal:0', 'step:1', 'step:2', 'meal:1'],
    wear: '快干内层 + 抓绒 + 防水外壳 + 防滑鞋；步行时随身带水。',
    mustDo: '雨天把上午登山直接替换为博物馆，不额外增加一条必走路线；遵守 Holyrood Park 现场封路标识。',
    tip: '不走 Radical Road 的封闭路段；今晚完成返程值机并核对明早去机场的站点。',
  },
  {
    date: '10/07', weekday: '周三', city: 'Edinburgh → HKG', title: '返程 · 次日抵达香港',
    start: '2026-10-07T00:00:00+01:00', end: '2026-10-08T15:20:00+08:00',
    steps: [
      { text: '从 Castle Rock 退房，暂按 08:15–08:30 出门，步行到 Waverley Bridge 乘 Airlink 100；也可步行到 Princes Street 乘机场电车。按当天交通倒推时间。', location: { name: 'Waverley Bridge · Airlink 100', query: 'Waverley Bridge Airlink 100 Edinburgh', mode: 'transit' } },
      { text: '目标 09:45 到 Edinburgh Airport，按需办理值机／证件检查并安检；为 12:50 起飞留足约 3 小时。', location: { name: 'Edinburgh Airport', query: 'Edinburgh Airport', mode: 'transit' } },
      { text: '12:50 从 EDI 起飞，经 Frankfurt 中转；登机口和转机安排以航空公司通知为准。', location: { name: 'Frankfurt Airport', query: 'Frankfurt Airport', mode: 'transit' } },
      { text: '10/8 15:20 抵达香港（北京时间）；入境后再返回深圳，当天仍需请假。', location: { name: 'Hong Kong International Airport', query: 'Hong Kong International Airport', mode: 'transit' } },
    ],
    food: [
      { time: '早餐', name: '住宿早餐 / 前晚超市备餐', dish: '提前准备面包、水果；不要为了早餐绕路，空水瓶带过安检后再接水。', price: '预算 £5–10/人', location: { name: 'Edinburgh Waverley 周边', query: 'Edinburgh Waverley Station', mode: 'walking' } },
      { time: '机场补给', name: 'Edinburgh Airport · 简餐', dish: '过安检后看登机口附近餐饮，先确认登机时间再坐下吃。', price: '预算 £10–18/人', location: { name: 'Edinburgh Airport', query: 'Edinburgh Airport', mode: 'walking' } },
    ],
    flow: ['meal:0', 'step:0', 'step:1', 'meal:1', 'step:2', 'step:3'],
    wear: '方便穿脱的三层衣物；机舱保留保暖层，香港落地再脱外套。',
    mustDo: '护照、登机牌、手机和充电线随身；10/7 是英国起飞日，10/8 才是香港落地日。',
    tip: '英国行程时间均为当地时间；香港抵达时间为北京时间，不用再加 7 小时。',
  },
];

const foodLinks: Record<string, string> = {
  'Borough Market': 'https://boroughmarket.org.uk/visit-us/',
  'Honest Burgers · London Bridge': 'https://www.honestburgers.co.uk/locations/london-bridge-tooley-st/',
  'Westminster Arms': 'https://www.westminsterarms.co.uk/contact-us',
  'Dumplings’ Legend · Chinatown': 'https://chinatown.co.uk/en/restaurant/dumplings-legend/',
  'Cambridge Market': 'https://www.cambridge.gov.uk/cambridge-market',
  'The Eagle · Cambridge': 'https://www.greeneking.co.uk/pubs/cambridgeshire/eagle/menu',
  'Master Wei · Bloomsbury': 'https://master-wei.com/',
  'Seven Dials Market': 'https://www.sevendialsmarket.com/visit-us/',
  'Market Halls · Victoria': 'https://markethalls.co.uk/venue/victoria/',
  'The Booking Office · Edinburgh': 'https://www.jdwetherspoon.com/pubs/the-booking-office-edinburgh/',
  'Oink · Victoria Street': 'https://www.oinkhogroast.co.uk/shops/',
  'Makars Mash Bar · The Mound': 'https://makarsmash.com/edinburgh/',
  'Museum Kitchen · National Museum': 'https://www.nms.ac.uk/national-museum-of-scotland/plan-your-visit/eating-and-drinking',
};

export function foodInfoUrl(name: string): string | undefined {
  return foodLinks[name];
}
