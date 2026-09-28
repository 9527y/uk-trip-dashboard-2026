import test from 'node:test';
import assert from 'node:assert/strict';
import { days } from '../lib/itinerary.ts';
import { dailyMapPoints } from '../lib/daily-map-points.ts';
import { dayMapLabels, pointsForDate, pointMapUrl } from '../lib/daily-map.ts';

test('每日地图覆盖所有英国行程日期，点位有名称、来源和有效的英国坐标', () => {
  assert.deepEqual([...new Set(dailyMapPoints.map(point => point.date))], days.map(day => day.date));
  assert.equal(new Set(dailyMapPoints.map(point => point.id)).size, dailyMapPoints.length);
  for (const day of days) {
    assert.ok(dayMapLabels[day.date]);
    assert.ok(pointsForDate(dailyMapPoints, day.date, false).length > 0);
  }
  for (const point of dailyMapPoints) {
    assert.ok(point.name && point.englishName && point.note && point.query && point.source);
    assert.ok(point.lat > 50 && point.lat < 57 && point.lng > -4 && point.lng < 1);
    assert.equal(new URL(pointMapUrl(point)).searchParams.get('query'), point.query);
  }
});

test('剑桥和白崖默认只显示当地，完整范围包含伦敦出发与回程地点', () => {
  const cambridge = pointsForDate(dailyMapPoints, '10/01', false);
  assert.ok(cambridge.every(point => point.lat > 52 && point.lat < 53));
  const coast = pointsForDate(dailyMapPoints, '10/03', false);
  assert.ok(coast.every(point => point.lat > 50.7 && point.lat < 50.8));
  assert.ok(coast.some(point => point.englishName === 'Exceat Bridge'));
  assert.ok(coast.some(point => point.englishName === 'Coastguard Cottages'));
  assert.ok(pointsForDate(dailyMapPoints, '10/01', true).some(point => point.query.includes('Platform 9')));
  assert.ok(pointsForDate(dailyMapPoints, '10/03', true).some(point => point.query.includes('Victoria')));
  assert.ok(pointsForDate(dailyMapPoints, '10/02', false).some(point => point.englishName === 'Wimbledon Lawn Tennis Museum'));
});
