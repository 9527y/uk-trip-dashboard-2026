import test from 'node:test';
import assert from 'node:assert/strict';
import { days } from '../lib/itinerary.ts';
import { taskSeed, taskSections, prepStages, trainSeed, restoreTasks, restoreTrains, railSearchUrl, isValidTrainTime, TRIP_END } from '../lib/trip-plan.ts';
import { getNightStay } from '../lib/stays.ts';

test('当晚住宿按英国当地日期切换，日游仍回伦敦，退房返程日不显示青旅', () => {
  assert.deepEqual(days.map((day) => {
    const overnight = getNightStay(day.start);
    return overnight ? [overnight.stay.id, overnight.night] : null;
  }), [
    ['barmy-badger', 1], ['barmy-badger', 2], ['barmy-badger', 3], ['barmy-badger', 4], ['barmy-badger', 5],
    ['castle-rock', 1], ['castle-rock', 2], ['castle-rock', 3], null,
  ]);
  assert.equal(getNightStay('2026-09-28T23:05:00+08:00'), null);
  assert.equal(getNightStay('2026-10-08T15:20:00+08:00'), null);
});

test('保留其他准备状态，旧住宿待办不覆盖新确认的预订，之后的手动修改仍能保存', () => {
  const restored = restoreTasks({ insurance: true, visa: false, 'stay-london': true, 'train-lon-oxf': true, trains: true, 'stay-london-5n': false, 'stay-edinburgh': false });
  assert.equal(restored.insurance, true);
  assert.equal(restored.visa, false);
  assert.equal(restored['stay-london-5n'], undefined);
  assert.equal(restored['stay-london-booked'], true);
  assert.equal(restored['stay-edinburgh-booked'], true);
  assert.equal(restoreTasks({ 'stay-london-booked': false })['stay-london-booked'], false);
  assert.equal(restored['train-london-edinburgh'], false);
  assert.equal(restored['train-cambridge-return'], false);
  assert.equal(restored['train-seaford-return'], false);
  assert.equal(restored['train-lon-oxf'], undefined);
  assert.deepEqual(restoreTasks(null), restoreTasks([]));
});

test('旧车次和损坏日期不会替换新路线，已编辑的有效票面时间可恢复', () => {
  const restored = restoreTrains([
    { id: 'lon-oxf', local: '2026-10-01T10:15', confirmed: true },
    { id: 'lon-cbg', local: '2026-10-01T09:12', confirmed: true, route: '旧路线', from: { code: 'BAD' } },
    { id: 'lon-sea', local: '2026-02-30T08:00', confirmed: true },
    { id: 'lon-edi', local: '2026-10-04T23:00', confirmed: false },
  ]);
  assert.equal(restored.length, 5);
  assert.equal(restored[0].local, '2026-10-01T09:12');
  assert.equal(restored[0].from.code, 'KGX');
  assert.equal(restored[0].to.code, 'CBG');
  assert.equal(restored[0].route, trainSeed[0].route);
  assert.equal(restored[2].local, trainSeed[2].local);
  assert.equal(restored[4].local, trainSeed[4].local);
  assert.equal(isValidTrainTime('2026-10-01T24:00'), false);
  assert.equal(isValidTrainTime('2026-10-01T09:12'), true);
  assert.deepEqual(restoreTrains({}), trainSeed);
});

test('调整白崖日期后，查询链接使用新的日期和时间', () => {
  const params = new URL(railSearchUrl('VIC', 'SEF', '2026-10-02T08:14')).searchParams;
  assert.equal(params.get('origin'), 'VIC');
  assert.equal(params.get('destination'), 'SEF');
  assert.equal(params.get('leavingDate'), '021026');
  assert.equal(params.get('leavingHour'), '08');
  assert.equal(params.get('leavingMin'), '14');
});

test('固定航班之间的每日日期无空隙，餐饮与步骤完整且交通待办均有对应项', () => {
  assert.equal(days.length, 9);
  assert.equal(new Date(days[0].start).toISOString(), '2026-09-29T06:55:00.000Z');
  assert.equal(new Date(days.at(-1).end).getTime(), TRIP_END);
  const taskIds = new Set(taskSeed.map(item => item.id));
  const trainIds = new Set(trainSeed.map(item => item.id));
  assert.equal(taskIds.size, taskSeed.length);
  for (const [index, day] of days.entries()) {
    if (index > 0) assert.equal(Date.parse(day.start) - Date.parse(days[index - 1].end), 1);
    const expectedFlow = [...day.steps.map((_, i) => `step:${i}`), ...day.food.map((_, i) => `meal:${i}`)].sort();
    assert.deepEqual([...day.flow].sort(), expectedFlow);
    for (const step of day.steps) if (step.trainId) assert.ok(trainIds.has(step.trainId));
  }
  for (const section of taskSections) for (const id of section.ids) assert.ok(taskIds.has(id));
  for (const stage of prepStages) for (const id of stage.taskIds) assert.ok(taskIds.has(id));
  for (const train of trainSeed) assert.ok(taskIds.has(train.taskId));
  assert.equal(trainSeed[0].taskId, trainSeed[1].taskId);
  assert.equal(trainSeed[2].taskId, trainSeed[3].taskId);
});
