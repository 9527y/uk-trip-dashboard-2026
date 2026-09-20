// Names and dates confirmed by the user's Hostelworld trip-list screenshot, 2026-09-20.
// Room type, payment and cancellation terms are not present in that screenshot.
export const londonStay = {
  id: 'barmy-badger',
  city: '伦敦',
  name: 'Barmy Badger Backpackers',
  checkIn: '2026-09-29',
  checkOut: '2026-10-04',
  nights: 5,
  address: '17 Longridge Road, Earl’s Court, London SW5 9SB',
  query: 'Barmy Badger Backpackers 17 Longridge Road London',
  website: 'https://www.barmybadger.com/',
  connection: 'Heathrow 乘 Piccadilly line 到 Earl’s Court，再步行前往青旅。去 King’s Cross 可乘 Piccadilly line，去 Victoria 可乘 District line。',
  reminder: '9/29 早到，出发前核对行李寄存和入住时间；剑桥、白崖当天往返期间继续住这里。',
};

export const edinburghStay = {
  id: 'castle-rock',
  city: '爱丁堡',
  name: 'Castle Rock Hostel',
  checkIn: '2026-10-04',
  checkOut: '2026-10-07',
  nights: 3,
  address: '15 Johnston Terrace, Edinburgh EH1 2PW',
  query: 'Castle Rock Hostel 15 Johnston Terrace Edinburgh EH1 2PW',
  website: 'https://www.castlerockedinburgh.com/',
  connection: 'Waverley 站步行到城堡脚下的青旅，途中有上坡；城堡、皇家英里和老城景点可步行游览。',
  reminder: '10/4 为铁路工程日，核对预计到达时间与晚到入住安排；10/7 退房后前往 EDI，目标 09:45 到机场。',
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
