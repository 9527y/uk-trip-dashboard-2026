// Names and dates confirmed by the user's Hostelworld trip-list screenshot, 2026-09-20.
// Room type, payment and cancellation terms are not present in that screenshot.
export const londonStay = {
  id: 'barmy-badger',
  city: '伦敦 London',
  name: '伦敦青旅 · Barmy Badger Backpackers',
  checkIn: '2026-09-29',
  checkOut: '2026-10-04',
  nights: 5,
  address: '17 Longridge Road, Earl’s Court, London SW5 9SB',
  query: 'Barmy Badger Backpackers 17 Longridge Road London',
  website: 'https://www.barmybadger.com/',
  connection: '从希思罗机场 Heathrow Airport 乘皮卡迪利线 Piccadilly line 到伯爵宫地铁站 Earl’s Court，再步行前往青旅。去国王十字火车站 London King’s Cross，可乘同线到国王十字圣潘克拉斯地铁站 King’s Cross St Pancras；去维多利亚火车站 London Victoria，可乘区域线 District line 到 Victoria 地铁站。',
  reminder: '9/29 早到，出发前核对行李寄存和入住时间；剑桥 Cambridge、七姐妹白崖 Seven Sisters 当天往返期间继续住这里。',
};

export const edinburghStay = {
  id: 'castle-rock',
  city: '爱丁堡 Edinburgh',
  name: '城堡岩青旅 · Castle Rock Hostel',
  checkIn: '2026-10-04',
  checkOut: '2026-10-07',
  nights: 3,
  address: '15 Johnston Terrace, Edinburgh EH1 2PW',
  query: 'Castle Rock Hostel 15 Johnston Terrace Edinburgh EH1 2PW',
  website: 'https://www.castlerockedinburgh.com/',
  connection: '从爱丁堡威瓦利火车站 Edinburgh Waverley 步行到城堡脚下的青旅，途中有上坡；爱丁堡城堡 Edinburgh Castle、皇家英里 Royal Mile 和老城 Old Town 景点可步行游览。',
  reminder: '10/4 为铁路工程日，核对预计到达时间与晚到入住安排；10/7 退房后前往爱丁堡机场 Edinburgh Airport（EDI），目标 09:45 到机场。',
};

export const stays = [londonStay, edinburghStay];

export function getNightStay(dayStart: string) {
  // Itinerary timestamps carry the local date; do not shift midnight into UTC's previous day.
  const date = dayStart.slice(0, 10);
  const stay = stays.find((item) => date >= item.checkIn && date < item.checkOut);
  if (!stay) return null;
  const night = Math.round((Date.parse(`${date}T00:00:00Z`) - Date.parse(`${stay.checkIn}T00:00:00Z`)) / 86_400_000) + 1;
  return { stay, night };
}

export function stayNavigationUrl(stay: (typeof stays)[number]) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(stay.query)}&travelmode=transit`;
}
