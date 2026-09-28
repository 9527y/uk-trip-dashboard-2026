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
    date: '09/29', weekday: '周二', city: '伦敦（London）', title: '抵达伦敦（London）· 塔桥（Tower Bridge）河岸',
    start: '2026-09-29T07:55:00+01:00', end: '2026-09-29T23:59:59.999+01:00',
    steps: [
      { text: '07:55 抵达希思罗机场（Heathrow Airport）；入境后乘皮卡迪利线（Piccadilly line）到伯爵宫地铁站（Earl’s Court），再步行到 Barmy Badger Backpackers 青旅。早到寄存与入住时间以青旅确认安排为准。', location: { name: 'Barmy Badger Backpackers 青旅', query: 'Barmy Badger Backpackers 17 Longridge Road London', mode: 'transit' } },
      { text: '博罗市场（Borough Market）午餐后，顺路看斯托尼街 7 号（7 Stoney Street）的破釜酒吧外景门口（The Leaky Cauldron filming location）：这里用于《哈利·波特与阿兹卡班的囚徒》的入口外景。只看门面，停留按约 10–15 分钟规划；落地延误或疲惫就跳过，不赶场。', location: { name: '破釜酒吧外景门口（The Leaky Cauldron filming location）', query: '7 Stoney Street London', mode: 'walking' } },
      { text: '下午只走伦敦桥（London Bridge）南岸一小段：海斯拱廊（Hay’s Galleria）→ 河岸步道 → 塔桥（Tower Bridge）；累了就先回住宿休息。', location: { name: '塔桥南岸公园（Potters Fields Park · Tower Bridge）', query: 'Potters Fields Park London', mode: 'walking' } },
      { text: '饭后若精神还好，在塔桥（Tower Bridge）附近看夜景后回住宿；不安排必须准时入场的景点。', location: { name: '塔桥（Tower Bridge）', query: 'Tower Bridge London', mode: 'walking' } },
    ],
    food: [
      { time: '午餐', name: '博罗市场（Borough Market）', dish: '在市场选热食或三明治；周二通常 10:00–17:00，落地延误就就近吃。', price: '预算 £12–20/人', location: { name: '博罗市场（Borough Market）', query: 'Borough Market 8 Southwark Street London', mode: 'transit' } },
      { time: '晚餐', name: 'Honest Burgers 汉堡店·伦敦桥店（London Bridge）', dish: '汉堡配薯条，也有素食选择；在伦敦桥（London Bridge）与塔桥（Tower Bridge）步行范围内。', price: '预算 £18–28/人', location: { name: 'Honest Burgers 汉堡店·伦敦桥店（London Bridge）', query: 'Honest Burgers London Bridge 6 Bermondsey Street', mode: 'walking' } },
    ],
    flow: ['step:0', 'meal:0', 'step:1', 'step:2', 'meal:1', 'step:3'],
    wear: '薄长袖 + 可收纳保暖层 + 防风防水外套；河边看夜景时加一层。',
    mustDo: 'Barmy Badger Backpackers 青旅已订 5 晚，9/29 入住、10/4 退房；寄存行李和入住时间待核对订单详情。',
    tip: '今天以恢复精神为主；南岸只走塔桥（Tower Bridge）附近，不从威斯敏斯特（Westminster）一路走到底。',
  },
  {
    date: '09/30', weekday: '周三', city: '伦敦（London）', title: '西区经典 · 白金汉宫（Buckingham Palace）与威斯敏斯特（Westminster）',
    start: '2026-09-30T00:00:00+01:00', end: '2026-09-30T23:59:59.999+01:00',
    steps: [
      { text: '上午看白金汉宫（Buckingham Palace）外观，经圣詹姆斯公园（St James’s Park）步行到威斯敏斯特（Westminster）。换岗仅在官方日历确认后加入。', location: { name: '白金汉宫（Buckingham Palace）', query: 'Buckingham Palace London', mode: 'transit' } },
      { text: '午后看大本钟（Big Ben）与议会广场（Parliament Square）；想入内参观威斯敏斯特教堂（Westminster Abbey），就预约下午较早时段并留约 2 小时。', location: { name: '威斯敏斯特教堂（Westminster Abbey）', query: 'Westminster Abbey London', mode: 'walking' } },
      { text: '傍晚往特拉法加广场（Trafalgar Square）慢慢走；体力不足就乘地铁或直接回住宿。', location: { name: '特拉法加广场（Trafalgar Square）', query: 'Trafalgar Square London', mode: 'walking' } },
      { text: '从特拉法加广场（Trafalgar Square）走到皮卡迪利广场（Piccadilly Circus），看《哈利·波特与死亡圣器（上）》外景地点；停留按约 10–15 分钟规划，再步行去唐人街（Chinatown）吃晚餐。', location: { name: '皮卡迪利广场（Piccadilly Circus）', query: 'Piccadilly Circus London', mode: 'walking' } },
    ],
    food: [
      { time: '午餐', name: 'Westminster Arms 英式酒吧', dish: '英式派或炸鱼薯条；就在教堂附近，周一至周六厨房通常 11:30–20:00。', price: '预算 £20–30/人', location: { name: 'Westminster Arms 英式酒吧', query: 'Westminster Arms 9 10 Storeys Gate London', mode: 'walking' } },
      { time: '晚餐', name: 'Dumplings’ Legend 中餐馆·唐人街（Chinatown）', dish: '小笼包配主食，按食量点；18:00 左右吃饭后结束当天行程。', price: '预算 £18–30/人', location: { name: 'Dumplings’ Legend 中餐馆·唐人街（Chinatown）', query: 'Dumplings Legend 15 16 Gerrard Street London', mode: 'walking' } },
    ],
    flow: ['step:0', 'meal:0', 'step:1', 'step:2', 'step:3', 'meal:1'],
    wear: '长袖 + 轻保暖层 + 防水外套；公园和河边比室内凉，穿耐走鞋。',
    mustDo: '威斯敏斯特教堂（Westminster Abbey）是否入内自行取舍；预约后以门票时间为准，不再加伦敦眼（London Eye）和另一所大型博物馆。',
    tip: '没有换岗也照常逛王宫和公园；不要按“单数日一定有”安排行程。',
  },
  {
    date: '10/01', weekday: '周四', city: '伦敦（London）↔ 剑桥（Cambridge）', title: '剑桥（Cambridge）一日游 · 学院与康河（River Cam）',
    start: '2026-10-01T00:00:00+01:00', end: '2026-10-01T23:59:59.999+01:00',
    steps: [
      { text: '从 Barmy Badger Backpackers 青旅经伯爵宫地铁站（Earl’s Court），乘皮卡迪利线（Piccadilly line）到国王十字圣潘克拉斯地铁站（King’s Cross St Pancras），出站转到国王十字火车站（London King’s Cross），再乘快车到剑桥火车站（Cambridge Station）；站到老城再留约 25–30 分钟步行，或现场选公交。', location: { name: '伦敦国王十字火车站（London King’s Cross）', query: 'London Kings Cross Station', mode: 'transit' }, trainId: 'lon-cbg' },
      { text: '到城里后先逛国王大道（King’s Parade）；只选国王学院礼拜堂（King’s College Chapel）一处学院景点入内，按可订时段调整上午顺序。', location: { name: '国王学院礼拜堂（King’s College Chapel）', query: 'Kings College Chapel Cambridge', mode: 'walking' } },
      { text: '午后参加有人掌篙的康河（River Cam）游船，或在学院后园（The Backs）河畔散步；再看三一街（Trinity Street）一带，不逐个赶学院。', location: { name: '康河磨坊巷撑篙码头（Mill Lane Punting Station）', query: 'Mill Lane Punting Station Cambridge', mode: 'walking' } },
      { text: '早晚餐后回剑桥火车站（Cambridge Station）；若选择 18:00 左右的车，建议 17:00 离开老城、17:30 前到站。具体仍以车票为准。', location: { name: '剑桥火车站（Cambridge Station）', query: 'Cambridge Railway Station Station Road', mode: 'transit' }, trainId: 'cbg-lon' },
      { text: '回到伦敦国王十字火车站（London King’s Cross）后，再去 9¾ 站台推车拍照点（Platform 9¾）。这是当前车站大厅内的主题拍照点，不是真实铁路站台；停留按 20–30 分钟规划，排队另计。到站晚或队伍长就跳过，把它留在回程，不影响早上赶火车。', location: { name: '9¾ 站台推车拍照点（Platform 9¾）', query: 'Harry Potter Platform 9 3/4 Kings Cross London', mode: 'walking' } },
    ],
    food: [
      { time: '午餐', name: '剑桥市场（Cambridge Market）', dish: '在剑桥集市广场（Cambridge Market Square）选街头热食；市场通常每日 10:00–16:00，摊位以当天为准。', price: '预算 £10–18/人', location: { name: '剑桥集市广场（Cambridge Market Square）', query: 'Cambridge Market Square Market Hill', mode: 'walking' } },
      { time: '早晚餐', name: 'The Eagle 酒吧·剑桥（Cambridge）', dish: '建议 16:15–17:00 吃英式酒吧餐；周四厨房通常到 22:00，赶车时不等长队。', price: '预算 £20–30/人', location: { name: 'The Eagle 酒吧·剑桥（Cambridge）', query: 'The Eagle Benet Street Cambridge', mode: 'walking' } },
    ],
    flow: ['step:0', 'step:1', 'meal:0', 'step:2', 'meal:1', 'step:3', 'step:4'],
    wear: '长袖 + 防风外套；撑篙坐着容易冷，把抓绒放进小背包。',
    mustDo: '大件行李留伦敦（London）；目的站是剑桥站（Cambridge），不是剑桥北站（Cambridge North）。往返车次和国王学院礼拜堂（King’s College Chapel）时段均待预订。',
    tip: '从 Barmy Badger Backpackers 青旅到剑桥（Cambridge）老城单程按约 2–2.5 小时规划，含地铁、候车与步行；全天往返约 4–5 小时。雨大时取消撑篙。',
  },
  {
    date: '10/02', weekday: '周五', city: '伦敦（London）', title: '大英博物馆（British Museum）· 西区慢逛',
    start: '2026-10-02T00:00:00+01:00', end: '2026-10-02T23:59:59.999+01:00',
    steps: [
      { text: '上午先到 Speedy’s 咖啡馆及旁边公寓门口（Speedy’s Café / BBC Sherlock 221B exterior），看 BBC《神探夏洛克》（Sherlock）的 221B 外景；这里不同于贝克街的福尔摩斯博物馆（Sherlock Holmes Museum, Baker Street）。总绕行按 30–60 分钟规划，拍照后步行约 20–25 分钟去大英博物馆（British Museum）；按已预约入馆时间倒推出门，时间不够就跳过，咖啡馆是否营业以当天为准。', location: { name: 'Speedy’s 咖啡馆及旁公寓门口（Speedy’s Café / BBC Sherlock 221B exterior）', query: 'Speedys Sandwich Bar Cafe 187 North Gower Street London NW1 2NJ', mode: 'transit' } },
      { text: '上午预约大英博物馆（British Museum）免费入场，建议从 10:00 左右开始，集中看埃及、希腊等 2–3 个主题。', location: { name: '大英博物馆（British Museum）', query: 'British Museum Great Russell Street London', mode: 'walking' } },
      { text: '下午走科文特花园（Covent Garden）→ 七晷街区（Seven Dials）；留咖啡、商店和休息时间，不再塞圣保罗大教堂（St Paul’s Cathedral）或另一家大馆。', location: { name: '科文特花园（Covent Garden）', query: 'Covent Garden London', mode: 'walking' } },
      { text: '晚饭后回住宿，买好明天七姐妹白崖（Seven Sisters）的水和便携午餐；再核对天气、铁路和沿海巴士。', location: { name: '科文特花园（Covent Garden）周边超市', query: 'supermarket near Covent Garden London', mode: 'walking' } },
    ],
    food: [
      { time: '午餐', name: 'Master Wei 面馆·布卢姆斯伯里店（Bloomsbury）', dish: '大英博物馆（British Museum）附近吃 biangbiang 面；官网确认布卢姆斯伯里（Bloomsbury）门店，具体营业时段当天再看。', price: '预算 £16–25/人', location: { name: 'Master Wei 面馆·布卢姆斯伯里店（Bloomsbury）', query: 'Master Wei 13 Cosmo Place Bloomsbury London', mode: 'walking' } },
      { time: '晚餐', name: '七晷街区美食市场（Seven Dials Market）', dish: '室内美食市场选主食；周五场馆通常 11:00–23:00，各厨房收餐时间可能不同。', price: '预算 £15–25/人', location: { name: '七晷街区美食市场（Seven Dials Market）', query: 'Seven Dials Market Earlham Street London', mode: 'walking' } },
    ],
    flow: ['step:0', 'step:1', 'meal:0', 'step:2', 'meal:1', 'step:3'],
    wear: '长袖 + 易穿脱外套；室内较暖，背小包方便安检。',
    mustDo: '大英博物馆（British Museum）与七姐妹白崖（Seven Sisters）可按天气对调，但先检查已订门票、车票的日期和改签条件。',
    tip: '明天是完整的一日往返；今晚不安排太晚的活动，把防水外套和步行鞋准备好。',
  },
  {
    date: '10/03', weekday: '周六', city: '伦敦（London）↔ 七姐妹白崖（Seven Sisters）', title: '七姐妹白崖（Seven Sisters）· 西岸观景短线',
    start: '2026-10-03T00:00:00+01:00', end: '2026-10-03T23:59:59.999+01:00',
    steps: [
      { text: '若选择 08:00 左右火车，约 07:00 离开 Barmy Badger Backpackers 青旅；经伯爵宫地铁站（Earl’s Court）乘区域线（District line）到维多利亚站（Victoria），转入伦敦维多利亚火车站（London Victoria），再经刘易斯（Lewes）换乘到锡福德（Seaford）。时间按实际车次调整。', location: { name: '伦敦维多利亚火车站（London Victoria）', query: 'London Victoria Station', mode: 'transit' }, trainId: 'lon-sea' },
      { text: '到锡福德（Seaford）后步行至锡福德图书馆公交站（Seaford Library），乘 12 路往伊斯特本（Eastbourne）方向，到七姐妹公园中心公交站（Seven Sisters Park Centre，位于埃克西特 Exceat）下车；下方导航定位附近的七姐妹游客中心（Seven Sisters Country Park Visitor Centre）。不要上终到锡福德（Seaford）的车。', location: { name: '七姐妹游客中心（Seven Sisters Country Park Visitor Centre）', query: 'Seven Sisters Country Park Visitor Centre Exceat', mode: 'transit' } },
      { text: '午餐后经 埃克西特桥（Exceat Bridge）走到卡克米尔河（River Cuckmere）西岸，往海岸警卫队小屋（Coastguard Cottages）看白崖；原路返回，全段加拍照休息留约 2–3 小时。', location: { name: '海岸警卫队小屋（Coastguard Cottages）· 卡克米尔河口（Cuckmere Haven）', query: 'Coastguard Cottages Cuckmere Haven Seaford', mode: 'walking' } },
      { text: '下午回七姐妹公园中心公交站（Seven Sisters Park Centre），乘往布莱顿（Brighton）方向的巴士回锡福德（Seaford）；再经刘易斯（Lewes）返回伦敦维多利亚火车站（London Victoria）。', location: { name: '锡福德火车站（Seaford Station）', query: 'Seaford Railway Station East Sussex', mode: 'transit' }, trainId: 'sea-lon' },
    ],
    food: [
      { time: '午餐', name: '自带野餐 · 埃克西特（Exceat）村游客中心附近', dish: '前一晚在伦敦（London）买好三明治、水果和水；到七姐妹游客中心（Seven Sisters Country Park Visitor Centre）附近先吃，不依赖海岸咖啡店营业。', price: '预算 £7–12/人', location: { name: '七姐妹游客中心（Seven Sisters Country Park Visitor Centre）', query: 'Seven Sisters Country Park Visitor Centre Exceat', mode: 'walking' } },
      { time: '晚餐', name: 'Market Halls 美食广场·维多利亚店（Victoria）', dish: '回伦敦（London）后在维多利亚火车站（London Victoria）附近吃热食；周六场馆通常到 23:00，先看各厨房是否仍接单。', price: '预算 £15–25/人', location: { name: 'Market Halls 美食广场·维多利亚店（Victoria）', query: 'Market Halls 191 Victoria Street London', mode: 'walking' } },
    ],
    flow: ['step:0', 'step:1', 'meal:0', 'step:2', 'step:3', 'meal:1'],
    wear: '防风防水连帽外套 + 保暖层 + 防滑步行鞋；带水和充电宝，海岸大风时不用伞。',
    mustDo: '出发前核对天气与回程公交；不涉水横渡卡克米尔河口（Cuckmere Haven），不靠崖边。大风、暴雨就改留伦敦（London）。',
    tip: '这次只走西岸小屋短线，不走到比灵盖普（Birling Gap）。门到门交通含巴士候车按约 5–6 小时留量，另加步行拍照。',
  },
  {
    date: '10/04', weekday: '周日', city: '伦敦（London）→ 爱丁堡（Edinburgh）', title: '北上爱丁堡（Edinburgh）· 留足交通时间',
    start: '2026-10-04T00:00:00+01:00', end: '2026-10-04T23:59:59.999+01:00',
    steps: [
      { text: '上午从 Barmy Badger Backpackers 青旅退房，带齐行李；经伯爵宫地铁站（Earl’s Court）乘皮卡迪利线（Piccadilly line）到国王十字圣潘克拉斯地铁站（King’s Cross St Pancras），出站转入国王十字火车站（London King’s Cross）；建议发车前 30 分钟进入火车站，今天不排格林尼治（Greenwich）等跨城景点。', location: { name: '伦敦国王十字火车站（London King’s Cross）', query: 'London Kings Cross Station', mode: 'transit' } },
      { text: '按购票后确认的班次乘 LNER 列车去爱丁堡威瓦利火车站（Edinburgh Waverley）。当天纽卡斯尔（Newcastle）一带施工，部分服务经卡莱尔（Carlisle）绕行，不能按平日 4.5 小时预计。', location: { name: '伦敦国王十字火车站（London King’s Cross）', query: 'London Kings Cross Station', mode: 'transit' }, trainId: 'lon-edi' },
      { text: '抵达爱丁堡威瓦利火车站（Edinburgh Waverley）后步行到城堡岩青旅（Castle Rock Hostel）入住，最后一段有上坡。晚间只在老城附近散步，不固定安排日落登山。', location: { name: '城堡岩青旅（Castle Rock Hostel）', query: 'Castle Rock Hostel 15 Johnston Terrace Edinburgh EH1 2PW', mode: 'walking' } },
    ],
    food: [
      { time: '上车前补给', name: '国王十字火车站（King’s Cross）· 列车餐', dish: '在车站买三明治、水果和饮用水带上车作午餐；不要依赖车上餐饮供应。', price: '预算 £8–15/人', location: { name: '国王十字火车站（King’s Cross）商店', query: 'London Kings Cross Station food shops', mode: 'walking' } },
      { time: '晚餐', name: 'The Booking Office 酒吧·爱丁堡（Edinburgh）', dish: '在威瓦利桥（Waverley Bridge）旁吃酒吧简餐；酒吧营业晚于厨房，抵达后先确认是否仍供餐。', price: '预算 £15–25/人', location: { name: 'The Booking Office 酒吧·爱丁堡（Edinburgh）', query: 'The Booking Office 17 Waverley Bridge Edinburgh', mode: 'walking' } },
    ],
    flow: ['step:0', 'meal:0', 'step:1', 'step:2', 'meal:1'],
    wear: '长袖 + 抓绒 + 防风防水外套；保暖层和充电线放随身小包。',
    mustDo: '城堡岩青旅（Castle Rock Hostel）已订 3 晚，10/4 入住、10/7 退房；买票前核对工程后的路线、抵达时间与青旅晚到入住安排。',
    tip: '工程日把全天留给北上，不锁定傍晚门票或用餐预约；也不再承诺右侧海景。',
  },
  {
    date: '10/05', weekday: '周一', city: '爱丁堡（Edinburgh）', title: '爱丁堡城堡（Edinburgh Castle）· 皇家英里（Royal Mile）与维多利亚街（Victoria Street）',
    start: '2026-10-05T00:00:00+01:00', end: '2026-10-05T23:59:59.999+01:00',
    steps: [
      { text: '上午按预约时间参观爱丁堡城堡（Edinburgh Castle），建议留 2–3 小时，结束后顺坡走入老城。', location: { name: '爱丁堡城堡（Edinburgh Castle）', query: 'Edinburgh Castle', mode: 'walking' } },
      { text: '午后逛维多利亚街（Victoria Street）与草市场（Grassmarket），再回到皇家英里大道（Royal Mile）、圣吉尔斯大教堂（St Giles’ Cathedral）一带；教堂入内按当天开放安排。', location: { name: '维多利亚街（Victoria Street）', query: 'Victoria Street Edinburgh', mode: 'walking' } },
      { text: '下午继续老城小巷或坐咖啡馆休息；想看玛丽金小巷（Mary King’s Close），可用它替换这段闲逛并提前预约。', location: { name: '皇家英里大道（Royal Mile）', query: 'Royal Mile Edinburgh', mode: 'walking' } },
    ],
    food: [
      { time: '午餐', name: 'Oink 烤猪肉店·维多利亚街（Victoria Street）', dish: '烤猪肉卷；通常 11:00–17:00 或售完即止，只作为午餐选项，售完就在附近换一家。', price: '预算 £10–16/人', location: { name: 'Oink 烤猪肉店·维多利亚街（Victoria Street）', query: 'Oink 34 Victoria Street Edinburgh', mode: 'walking' } },
      { time: '晚餐', name: 'Makars Mash Bar 土豆泥餐馆·土丘一带（The Mound）', dish: '肉类或蘑菇配土豆泥；建议 18:00 左右，最后点餐通常 20:30，热门时段可预约。', price: '预算 £25–38/人', location: { name: 'Makars Mash Bar 土豆泥餐馆·土丘一带（The Mound）', query: 'Makars Mash Bar 9 12 Bank Street Edinburgh', mode: 'walking' } },
    ],
    flow: ['step:0', 'meal:0', 'step:1', 'step:2', 'meal:1'],
    wear: '长袖 + 保暖层 + 防风外套；城堡风大，石板路需要防滑鞋。',
    mustDo: '提前预订爱丁堡城堡（Edinburgh Castle）入场；玛丽金小巷（Mary King’s Close）是可选替换项，不和其他付费导览一起塞满。',
    tip: 'Oink 烤猪肉店不适合安排夜晚；Makars Mash Bar 土豆泥餐馆现场等位可能较久，不愿排队就选老城附近其他热食。',
  },
  {
    date: '10/06', weekday: '周二', city: '爱丁堡（Edinburgh）', title: '亚瑟王座（Arthur’s Seat）· 苏格兰国家博物馆（National Museum of Scotland）',
    start: '2026-10-06T00:00:00+01:00', end: '2026-10-06T23:59:59.999+01:00',
    steps: [
      { text: '上午天气合适就走荷里路德公园（Holyrood Park）/ 亚瑟王座（Arthur’s Seat），步行与休息留 2–3 小时；遇大风或路滑，改从 10:00 起逛苏格兰国家博物馆（National Museum of Scotland）。', location: { name: '荷里路德公园（Holyrood Park）· 亚瑟王座（Arthur’s Seat）', query: 'Holyrood Park Edinburgh', mode: 'walking' } },
      { text: '午餐后逛苏格兰国家博物馆（National Museum of Scotland），通常 17:00 闭馆；若上午已因雨入馆，下午继续选喜欢的展厅即可。', location: { name: '苏格兰国家博物馆（National Museum of Scotland）', query: 'National Museum of Scotland Chambers Street Edinburgh', mode: 'walking' } },
      { text: '傍晚按体力在王子街花园（Princes Street Gardens）周边短走或直接回住宿；整理行李、保存返程登机资料。', location: { name: '王子街花园（Princes Street Gardens）', query: 'Princes Street Gardens Edinburgh', mode: 'walking' } },
    ],
    food: [
      { time: '午餐', name: 'Museum Kitchen 馆内餐厅·苏格兰国家博物馆（National Museum of Scotland）', dish: '馆内 Level 0 吃热食、披萨或三明治；通常 10:00–17:00，最后点餐 16:45。', price: '预算 £12–22/人', location: { name: 'Museum Kitchen 馆内餐厅·苏格兰国家博物馆（National Museum of Scotland）', query: 'Museum Kitchen National Museum of Scotland Chambers Street', mode: 'walking' } },
      { time: '晚餐', name: '住宿附近 · 超市轻食', dish: '买沙拉、三明治或热食回住宿；需要加热的食物先确认住宿有厨房。', price: '预算 £8–14/人', location: { name: '爱丁堡威瓦利火车站（Edinburgh Waverley）周边超市', query: 'supermarket near Edinburgh Waverley Station', mode: 'walking' } },
    ],
    flow: ['step:0', 'meal:0', 'step:1', 'step:2', 'meal:1'],
    wear: '快干内层 + 抓绒 + 防水外壳 + 防滑鞋；步行时随身带水。',
    mustDo: '雨天把上午登山直接替换为苏格兰国家博物馆（National Museum of Scotland），不额外增加一条必走路线；遵守荷里路德公园（Holyrood Park）现场封路标识。',
    tip: '不走 Radical Road 山路的封闭路段；今晚完成返程值机并核对明早去机场的站点。',
  },
  {
    date: '10/07', weekday: '周三', city: '爱丁堡（Edinburgh）→ 香港（Hong Kong · HKG）', title: '返程 · 次日抵达香港（Hong Kong）',
    start: '2026-10-07T00:00:00+01:00', end: '2026-10-08T15:20:00+08:00',
    steps: [
      { text: '从城堡岩青旅（Castle Rock Hostel）退房，暂按 08:15–08:30 出门，步行到威瓦利桥（Waverley Bridge）乘 Airlink 100 机场巴士；也可步行到王子街（Princes Street）乘机场电车。按当天交通倒推时间。', location: { name: '威瓦利桥（Waverley Bridge）· Airlink 100 机场巴士', query: 'Waverley Bridge Airlink 100 Edinburgh', mode: 'transit' } },
      { text: '目标 09:45 到爱丁堡机场（Edinburgh Airport），按需办理值机／证件检查并安检；为 12:50 起飞留足约 3 小时。', location: { name: '爱丁堡机场（Edinburgh Airport）', query: 'Edinburgh Airport', mode: 'transit' } },
      { text: '12:50 从爱丁堡机场（Edinburgh Airport · EDI）起飞，经法兰克福机场（Frankfurt Airport）中转；登机口和转机安排以航空公司通知为准。', location: { name: '法兰克福机场（Frankfurt Airport）', query: 'Frankfurt Airport', mode: 'transit' } },
      { text: '10/8 15:20 抵达香港国际机场（Hong Kong International Airport，北京时间）；入境后再返回深圳（Shenzhen），当天仍需请假。', location: { name: '香港国际机场（Hong Kong International Airport）', query: 'Hong Kong International Airport', mode: 'transit' } },
    ],
    food: [
      { time: '早餐', name: '住宿早餐 / 前晚超市备餐', dish: '提前准备面包、水果；不要为了早餐绕路，空水瓶带过安检后再接水。', price: '预算 £5–10/人', location: { name: '爱丁堡威瓦利火车站（Edinburgh Waverley）周边', query: 'Edinburgh Waverley Station', mode: 'walking' } },
      { time: '机场补给', name: '爱丁堡机场（Edinburgh Airport）· 简餐', dish: '过安检后看登机口附近餐饮，先确认登机时间再坐下吃。', price: '预算 £10–18/人', location: { name: '爱丁堡机场（Edinburgh Airport）', query: 'Edinburgh Airport', mode: 'walking' } },
    ],
    flow: ['meal:0', 'step:0', 'step:1', 'meal:1', 'step:2', 'step:3'],
    wear: '方便穿脱的三层衣物；机舱保留保暖层，香港落地再脱外套。',
    mustDo: '护照、登机牌、手机和充电线随身；10/7 是英国起飞日，10/8 才是香港落地日。',
    tip: '英国行程时间均为当地时间；香港抵达时间为北京时间，不用再加 7 小时。',
  },
];

const foodLinks: Record<string, string> = {
  '博罗市场（Borough Market）': 'https://boroughmarket.org.uk/visit-us/',
  'Honest Burgers 汉堡店·伦敦桥店（London Bridge）': 'https://www.honestburgers.co.uk/locations/london-bridge-tooley-st/',
  'Westminster Arms 英式酒吧': 'https://www.westminsterarms.co.uk/contact-us',
  'Dumplings’ Legend 中餐馆·唐人街（Chinatown）': 'https://chinatown.co.uk/en/restaurant/dumplings-legend/',
  '剑桥市场（Cambridge Market）': 'https://www.cambridge.gov.uk/cambridge-market',
  'The Eagle 酒吧·剑桥（Cambridge）': 'https://www.greeneking.co.uk/pubs/cambridgeshire/eagle/menu',
  'Master Wei 面馆·布卢姆斯伯里店（Bloomsbury）': 'https://master-wei.com/',
  '七晷街区美食市场（Seven Dials Market）': 'https://www.sevendialsmarket.com/visit-us/',
  'Market Halls 美食广场·维多利亚店（Victoria）': 'https://markethalls.co.uk/venue/victoria/',
  'The Booking Office 酒吧·爱丁堡（Edinburgh）': 'https://www.jdwetherspoon.com/pubs/the-booking-office-edinburgh/',
  'Oink 烤猪肉店·维多利亚街（Victoria Street）': 'https://www.oinkhogroast.co.uk/shops/',
  'Makars Mash Bar 土豆泥餐馆·土丘一带（The Mound）': 'https://makarsmash.com/edinburgh/',
  'Museum Kitchen 馆内餐厅·苏格兰国家博物馆（National Museum of Scotland）': 'https://www.nms.ac.uk/national-museum-of-scotland/plan-your-visit/eating-and-drinking',
};

export function foodInfoUrl(name: string): string | undefined {
  return foodLinks[name];
}
