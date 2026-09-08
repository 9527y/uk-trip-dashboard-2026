'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Coins,
  ExternalLink,
  ForkKnife,
  MapPin,
  Pencil,
  Plane,
  RotateCcw,
  TrainFront,
  Umbrella,
  WalletCards,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress, ProgressLabel, ProgressValue } from '@/components/ui/progress';

const TRIP_START = new Date('2026-09-28T23:05:00+08:00').getTime();
const TRIP_END = new Date('2026-10-08T15:20:00+08:00').getTime();

const milestones = [
  { label: 'SWISS 去程值机开放', time: new Date('2026-09-27T23:05:00+08:00').getTime(), note: '若尚未开放，9/28 00:05 再试' },
  { label: 'HKG 起飞', time: TRIP_START, note: '建议 20:00 前抵达机场' },
  { label: '抵达 London Heathrow', time: new Date('2026-09-29T07:55:00+01:00').getTime(), note: '英国当地时间' },
  { label: 'Lufthansa 回程值机开放', time: new Date('2026-10-06T06:50:00+01:00').getTime(), note: 'Edinburgh 当地时间' },
  { label: 'EDI 起飞', time: new Date('2026-10-07T12:50:00+01:00').getTime(), note: '09:45–10:00 抵达机场' },
  { label: '抵达 Hong Kong', time: TRIP_END, note: '10/08 15:20 香港时间' },
];

const taskSeed = [
  { id: 'flight', label: '国际机票已确认', group: '已完成', done: true },
  { id: 'visa', label: '英国签证有效', group: '已完成', done: true },
  { id: 'stays', label: '预订 8 晚住宿', group: '尽快', done: false },
  { id: 'trains', label: '购买 4 段城际火车', group: '尽快', done: false },
  { id: 'attractions', label: '预约 5 个重点景点', group: '本周', done: false },
  { id: 'insurance', label: '购买旅行保险', group: '出发前', done: false },
  { id: 'esim', label: '开通 UK eSIM', group: '出发前', done: false },
  { id: 'bags', label: '核对两个背包尺寸和重量', group: '出发前', done: false },
  { id: 'airport', label: '确定深圳 ↔ HKG 交通', group: '出发前', done: false },
  { id: 'checkin', label: '完成去程在线值机', group: '9/27–9/28', done: false },
];

const trainSeed = [
  { id: 'lon-oxf', date: '10/02 周五', route: 'London Paddington → Oxford', local: '2026-10-02T08:00', note: '暂定 08:00｜直达约 1 小时' },
  { id: 'oxf-bth', date: '10/02 周五', route: 'Oxford → Bath Spa', local: '2026-10-02T16:30', note: '暂定 16:30｜优先 GWR 直达' },
  { id: 'bth-yor', date: '10/03 周六', route: 'Bath Spa → York', local: '2026-10-03T14:30', note: '暂定 14:30｜最多 1 次换乘' },
  { id: 'yor-edi', date: '10/04 周日', route: 'York → Edinburgh Waverley', local: '2026-10-04T16:00', note: '暂定 16:00｜LNER 直达约 2.5 小时' },
];

const days = [
  {
    date: '09/29', weekday: '周二', city: 'London', title: '初见伦敦 · Westminster',
    start: '2026-09-29T07:55:00+01:00', end: '2026-09-29T23:59:00+01:00',
    steps: ['07:55 抵达 LHR，Elizabeth line 进城', 'Westminster → St James’s Park → Buckingham Palace', 'Trafalgar Square → South Bank，早点休息'],
    food: [
      { time: '早午餐', name: 'Regency Café', dish: '英式早餐套餐', price: '£9.99' },
      { time: '晚餐', name: 'Chinatown', dish: '面食或烧味饭', price: '£12–18' },
    ],
    tip: '第一天不要排长队景点，给入境和时差留余量。',
  },
  {
    date: '09/30', weekday: '周三', city: 'London', title: '城堡、塔桥与河岸',
    start: '2026-09-30T00:00:00+01:00', end: '2026-09-30T23:59:00+01:00',
    steps: ['09:00 Tower of London，先看 Crown Jewels', 'Tower Bridge → Borough Market 午餐', 'Tate Modern → Millennium Bridge → St Paul’s 外观'],
    food: [
      { time: '午餐', name: 'Shellseekers / Applebee’s Fish', dish: '鱼肉三明治或海鲜', price: '£12–20' },
      { time: '晚餐', name: 'Roti King Euston', dish: 'Roti canai 或 nasi lemak', price: '£12–18' },
    ],
    tip: 'Kappacasein 周三关闭；不要专程排它的芝士吐司。',
  },
  {
    date: '10/01', weekday: '周四', city: 'London', title: '博物馆与西区街巷',
    start: '2026-10-01T00:00:00+01:00', end: '2026-10-01T23:59:00+01:00',
    steps: ['10:00 British Museum，只选 2–3 个主题', 'Covent Garden → Seven Dials', 'Soho → Chinatown → National Gallery 可选'],
    food: [
      { time: '午餐', name: 'Master Wei · Bloomsbury', dish: '油泼或牛肉 biangbiang 面', price: '£13–18' },
      { time: '补给', name: '超市 meal deal', dish: '三明治 + 零食 + 饮料', price: '约 £5' },
    ],
    tip: '晚上整理行李并下载第二天两段火车票。',
  },
  {
    date: '10/02', weekday: '周五', city: 'Oxford → Bath', title: '大学城与古罗马温泉城',
    start: '2026-10-02T00:00:00+01:00', end: '2026-10-02T23:59:00+01:00',
    steps: ['早班车至 Oxford，背包随身或提前预约寄存', 'Christ Church Meadow → Radcliffe Camera → 一所学院', '16:00–17:00 前往 Bath，夜游 Pulteney Bridge'],
    food: [
      { time: '午餐', name: 'Oxford Covered Market', dish: 'Sasi’s Thai / Pieminister', price: '£9–14' },
      { time: '晚餐', name: 'Chaiwalla · Bath', dish: '咖喱饭或 wrap + samosa', price: '£8–10' },
    ],
    tip: 'Oxford 只参观一所学院，宁可从容赶车。',
  },
  {
    date: '10/03', weekday: '周六', city: 'Bath → York', title: 'Roman Baths 与北上列车',
    start: '2026-10-03T00:00:00+01:00', end: '2026-10-03T23:59:00+01:00',
    steps: ['09:00 Roman Baths', 'Bath Abbey → The Circus → Royal Crescent', '14:00–15:00 北上 York，抵达后夜逛 Shambles'],
    food: [
      { time: '早午餐', name: 'Sally Lunn’s', dish: 'Sally Lunn bun', price: '£8–15' },
      { time: '列车餐', name: '超市补给', dish: '水、三明治和水果', price: '£6–9' },
    ],
    tip: 'Sally Lunn’s 12:30–14:30 最忙，Roman Baths 后尽早去。',
  },
  {
    date: '10/04', weekday: '周日', city: 'York → Edinburgh', title: '中世纪老城与苏格兰',
    start: '2026-10-04T00:00:00+01:00', end: '2026-10-04T23:59:00+01:00',
    steps: ['城墙短线 → Shambles → Museum Gardens', '12:45 York Minster', '15:30–16:30 LNER 直达 Edinburgh'],
    food: [
      { time: '早午餐', name: 'Shambles Kitchen', dish: '烟熏猪肉或牛肉三明治', price: '£10.50–11.90' },
      { time: '晚餐', name: 'Oink · Victoria Street', dish: '猪肉卷，可配 haggis stuffing', price: '£6.65–11.95' },
    ],
    tip: '先吃早午餐再进 Minster，别把吃饭押在赶车空档。',
  },
  {
    date: '10/05', weekday: '周一', city: 'Edinburgh', title: '城堡与 Royal Mile',
    start: '2026-10-05T00:00:00+01:00', end: '2026-10-05T23:59:00+01:00',
    steps: ['09:30 Edinburgh Castle', 'Royal Mile → St Giles’ → Victoria Street', 'National Museum → 天气好再上 Calton Hill'],
    food: [
      { time: '午餐', name: 'Oink', dish: 'Piglet 小份猪肉卷', price: '£6.65' },
      { time: '晚餐', name: 'MUMS Great Comfort Food', dish: '香肠、土豆泥和肉汁', price: '£15–22' },
    ],
    tip: '城堡和山顶风大，随身带防水外套。',
  },
  {
    date: '10/06', weekday: '周二', city: 'Edinburgh', title: '自然景观与机动日',
    start: '2026-10-06T00:00:00+01:00', end: '2026-10-06T23:59:00+01:00',
    steps: ['晴天：Holyrood Park / Arthur’s Seat', '下午：Dean Village 或 Stockbridge', '雨天：National Museum + National Gallery'],
    food: [
      { time: '午餐', name: 'Mosque Kitchen', dish: '咖喱饭或烤肉，素食可选', price: '£10–15' },
      { time: '晚餐', name: '超市 + Hostel', dish: '轻食并整理行李', price: '£6–10' },
    ],
    tip: '06:50 起可办理回程值机；晚上保存两段登机牌。',
  },
  {
    date: '10/07', weekday: '周三', city: 'Edinburgh → HKG', title: '返程日',
    start: '2026-10-07T00:00:00+01:00', end: '2026-10-08T15:20:00+08:00',
    steps: ['08:45–09:00 离开市区', 'Tram 约 30 分钟，09:45–10:00 到 EDI', '12:50 起飞；FRA 中转 5 小时 50 分钟'],
    food: [
      { time: '早餐', name: 'Hostel / 超市', dish: '面包、水果和咖啡', price: '£5–8' },
      { time: '机场', name: '登机前补给', dish: '简餐 + 空水瓶过安检', price: '£8–12' },
    ],
    tip: 'FRA 中转不建议进城；先确认登机口再休息。',
  },
];

const foodLinks = [
  ['Regency Café', 'https://regencycafe.co.uk/menu'],
  ['Borough Market', 'https://boroughmarket.org.uk/visit-us/'],
  ['Roti King', 'https://rotiking.com/location/euston/'],
  ['Oxford Covered Market', 'https://oxford-coveredmarket.co.uk/'],
  ['Chaiwalla', 'https://chaiwalla.uk/menu'],
  ['Sally Lunn’s', 'https://www.sallylunns.co.uk/menus/'],
  ['Shambles Kitchen', 'https://www.shambleskitchen.co.uk/'],
  ['Oink', 'https://www.oinkhogroast.co.uk/shops/victoria-street/'],
  ['Mosque Kitchen', 'https://www.mosquekitchen.com/contact-us'],
];

function formatCountdown(target: number, now: number) {
  if (!now) return '正在计算';
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

export default function Home() {
  const [now, setNow] = useState(0);
  const [tasks, setTasks] = useState<Record<string, boolean>>(() => Object.fromEntries(taskSeed.map((task) => [task.id, task.done])));
  const [trains, setTrains] = useState(() => trainSeed);
  const [editingTrain, setEditingTrain] = useState<string | null>(null);
  const [rate, setRate] = useState(9.09);
  const [pounds, setPounds] = useState(80);

  useEffect(() => {
    const savedTasks = window.localStorage.getItem('uk-trip-tasks-v1');
    const savedTrains = window.localStorage.getItem('uk-trip-trains-v1');
    const initialTick = window.setTimeout(() => {
      if (savedTasks) setTasks(JSON.parse(savedTasks));
      if (savedTrains) setTrains(JSON.parse(savedTrains));
      setNow(Date.now());
    }, 0);
    const timer = window.setInterval(() => setNow(Date.now()), 1_000);
    return () => {
      window.clearTimeout(initialTick);
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

  const completed = Object.values(tasks).filter(Boolean).length;
  const taskProgress = Math.round((completed / taskSeed.length) * 100);
  const tripProgress = now ? Math.max(0, Math.min(100, ((now - TRIP_START) / (TRIP_END - TRIP_START)) * 100)) : 0;
  const nextMilestone = useMemo(() => milestones.find((item) => item.time > now) ?? milestones.at(-1)!, [now]);

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
        <a className="brand" href="#top" aria-label="返回顶部"><span className="brand-mark">UK</span><span>Tripboard</span></a>
        <div className="nav-links"><a href="#todo">待办</a><a href="#route">行程</a><a href="#trains">列车</a><a href="#money">换汇</a></div>
        <span className="date-chip">9/28–10/08</span>
      </nav>

      <div className="page-shell" id="top">
        <section className="hero-grid" aria-labelledby="trip-title">
          <div className="hero-copy">
            <p className="eyebrow"><Plane aria-hidden="true" /> 已确认 · Economy Light</p>
            <h1 id="trip-title">九天穿过<br />英格兰与苏格兰</h1>
            <p className="route-line">Hong Kong <ArrowRight /> London <ArrowRight /> Edinburgh</p>
            <div className="hero-actions"><a className="primary-action" href="#todo">查看下一步 <ChevronRight /></a><a className="secondary-action" href="#route">展开每日行程</a></div>
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
              <div className="todo-list">
                {taskSeed.map((task) => (
                  <label className={`todo-row ${tasks[task.id] ? 'is-done' : ''}`} key={task.id}>
                    <Checkbox checked={tasks[task.id]} onCheckedChange={(checked) => updateTask(task.id, Boolean(checked))} aria-label={task.label} />
                    <span className="todo-label">{task.label}</span><span className="todo-group">{task.group}</span>
                  </label>
                ))}
              </div>
            </article>
            <aside className="priority-stack">
              <article className="priority-card urgent"><span>优先级 01</span><h3>住宿 + 四段火车</h3><p>价格和余量最容易变化，先于景点门票处理。</p></article>
              <article className="priority-card"><span>优先级 02</span><h3>五个预约景点</h3><p>Tower、Roman Baths、York Minster、Edinburgh Castle、Oxford 学院。</p></article>
              <article className="priority-card dark-card"><span>值机提醒</span><h3>9/27 23:05 后尝试</h3><p>SWISS 去程值机；准备护照和六位预订编号。</p></article>
            </aside>
          </div>
        </section>

        <section className="section" id="trains">
          <div className="section-heading"><div><p className="eyebrow"><TrainFront /> Rail countdown</p><h2>列车倒计时</h2></div><Button variant="ghost" onClick={resetTrainTimes}><RotateCcw /> 恢复暂定时间</Button></div>
          <p className="section-intro">当前是建议窗口中的暂定时间。买票后点“改时间”，换成票面上的英国当地时间。</p>
          <div className="train-grid">
            {trains.map((train, index) => (
              <article className="train-card" key={train.id}>
                <div className="train-index">0{index + 1}</div>
                <div className="train-meta"><span>{train.date}</span><span>{train.note}</span></div>
                <h3>{train.route}</h3><p className="train-countdown">{formatCountdown(ukTimeToInstant(train.local), now)}</p>
                {editingTrain === train.id ? (
                  <div className="train-editor"><label htmlFor={`time-${train.id}`}>英国当地日期和时间</label><input id={`time-${train.id}`} type="datetime-local" value={train.local} onChange={(event) => updateTrain(train.id, event.target.value)} /><Button size="sm" onClick={() => setEditingTrain(null)}>保存</Button></div>
                ) : <Button size="sm" variant="outline" onClick={() => setEditingTrain(train.id)}><Pencil /> 改成票面时间</Button>}
              </article>
            ))}
          </div>
        </section>

        <section className="section route-section" id="route">
          <div className="section-heading"><div><p className="eyebrow"><MapPin /> 逐日执行</p><h2>一路向北</h2></div><span className="section-metric">8 晚 · 5 城</span></div>
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
                    <div className="day-content">
                      <ol className="step-list">{day.steps.map((step) => <li key={step}>{step}</li>)}</ol>
                      <div className="food-list">{day.food.map((meal) => <div className="meal" key={`${day.date}-${meal.name}`}><span className="meal-time">{meal.time}</span><strong>{meal.name}</strong><span>{meal.dish}</span><b>{meal.price}</b></div>)}</div>
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
          <div className="section-heading"><div><p className="eyebrow"><ForkKnife /> 已核对营业信息</p><h2 id="food-title">餐饮清单</h2></div></div>
          <div className="link-grid">{foodLinks.map(([name, href]) => <a key={name} href={href} target="_blank" rel="noreferrer"><span>{name}</span><ExternalLink /></a>)}</div>
          <p className="source-note">价格和营业时间在 2026-09-08 核对；旅行当天仍以店铺公告为准。London 交通请全程使用同一张卡或同一台手机触碰闸机，以正确计算每日封顶。</p>
        </section>

        <footer><div><span className="brand-mark">UK</span><strong>Tripboard 2026</strong></div><p>轻装、顺路、留一点余地。</p></footer>
      </div>
    </main>
  );
}
