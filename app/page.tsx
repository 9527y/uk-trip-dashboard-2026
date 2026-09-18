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

import { days, foodInfoUrl, type Place, type TripDay } from '@/lib/itinerary';
import {
  TRIP_START, TRIP_END, TASK_STORAGE_KEY, TRAIN_STORAGE_KEY,
  milestones, taskSeed, taskSections, prepStages, trainSeed,
  transportSources, railSearchUrl, restoreTasks, restoreTrains, isValidTrainTime,
  type RailStation,
} from '@/lib/trip-plan';
import { LocalTransport } from '@/components/local-transport';

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
        const savedTasks = window.localStorage.getItem(TASK_STORAGE_KEY) ?? window.localStorage.getItem('uk-trip-tasks-v1');
        if (savedTasks) {
          try { setTasks(restoreTasks(JSON.parse(savedTasks))); } catch { /* Use the current checklist if saved data is damaged. */ }
        }
        const savedTrains = window.localStorage.getItem(TRAIN_STORAGE_KEY);
        if (savedTrains) {
          try { setTrains(restoreTrains(JSON.parse(savedTrains))); } catch { /* Keep the new route when old train data is damaged. */ }
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
            window.localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(next));
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
          if (!trainSeed.some((train) => train.id === value.trainId) || !isValidTrainTime(value.localTime)) {
            throw new Error('无效的列车编号或时间格式');
          }
          setTrains((current) => {
            const next = current.map((train) => train.id === value.trainId ? { ...train, local: value.localTime!, confirmed: true, note: `票面时间 ${value.localTime!.slice(11)}` } : train);
            window.localStorage.setItem(TRAIN_STORAGE_KEY, JSON.stringify(next));
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
  const phaseTitle = beforeTrip ? prepStage.title : outbound ? '正在前往伦敦' : afterTrip ? '已过计划返程时间' : activeDay!.title;
  const phaseSummary = beforeTrip ? prepStage.summary : outbound ? '今晚的重点是顺利转机和保留休息时间。' : afterTrip ? '页面保留行程供回看，实际抵达与完成情况以你的旅程为准。' : `${activeDay!.city} · ${activeDay!.date} ${activeDay!.weekday}`;
  const currentTimeZone = beforeTrip || afterTrip ? 'Asia/Shanghai' : 'Europe/London';
  const activeAgenda = activeDay ? getDayAgenda(activeDay) : [];
  const mealSummary = days.flatMap((day) => day.food.map((meal) => ({
    day,
    meal,
    href: foodInfoUrl(meal.name),
  })));

  function taskLink(task: (typeof taskSeed)[number]) {
    const train = trains.find(item => item.taskId === task.id);
    return train ? railSearchUrl(train.from.code, train.to.code, train.local) : task.href;
  }

  function updateTask(id: string, value: boolean) {
    const next = { ...tasks, [id]: value };
    setTasks(next);
    window.localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(next));
  }

  function updateTrain(id: string, local: string) {
    if (!isValidTrainTime(local)) return;
    const next = trains.map((train) => train.id === id ? { ...train, local, confirmed: true, note: `票面时间 ${local.slice(11)}` } : train);
    setTrains(next);
    window.localStorage.setItem(TRAIN_STORAGE_KEY, JSON.stringify(next));
  }

  function resetTrainTimes() {
    setTrains(trainSeed);
    window.localStorage.removeItem(TRAIN_STORAGE_KEY);
    setEditingTrain(null);
  }

  return (
    <main>
      <nav className="topbar" aria-label="页面导航">
        <a className="brand" href="#now" aria-label="返回当前安排"><span className="brand-mark">UK</span><span>Tripboard</span></a>
        <div className="nav-links"><a href="#now">现在</a><a href="#todo">待办</a><a href="#packing">穿衣</a><a href="#trains">火车</a><a href="#local-transport">公交</a><a href="#map">地图</a><a href="#route">行程</a><a href="#money">换汇</a></div>
        <span className="date-chip">9/28–10/08</span>
      </nav>

      <div className="page-shell" id="top">
        <section className={`now-board ${beforeTrip ? 'is-prep' : activeDay ? 'is-travel' : ''}`} id="now" aria-labelledby="now-title">
          <div className="now-summary">
            <p className="live-label"><span aria-hidden="true" />{phaseLabel}</p>
            <p className="now-clock">{formatCurrentMoment(now, currentTimeZone)} · {beforeTrip || afterTrip ? '北京时间' : '英国时间'}</p>
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
                    {task.href && <a className="now-task-action" href={taskLink(task)} target="_blank" rel="noreferrer">{task.action ?? '打开'} <ExternalLink /></a>}
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
            <h2 id="trip-title">两处基地<br />慢慢看英国</h2>
            <p className="route-line">伦敦 5 晚 <ArrowRight /> 爱丁堡 3 晚</p><p className="hero-itinerary">10/1 剑桥当天往返 · 10/3 白崖短线当天往返</p><p className="hero-revision">2026-09-19 更新 · 英国行程 9/29–10/7</p>
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
            <Progress value={tripProgress} className="trip-progress"><ProgressLabel>{now < TRIP_START ? '出发前准备' : now > TRIP_END ? '计划行程已结束' : '旅行进行中'}</ProgressLabel><ProgressValue>{Math.round(tripProgress)}%</ProgressValue></Progress>
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
                          {task.href && <a className="task-action" href={taskLink(task)} target="_blank" rel="noreferrer">{task.action ?? '打开'} <ExternalLink /></a>}
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </article>
            <aside className="priority-stack">
              <article className="priority-card urgent"><span>优先级 01</span><h3>先确认 10/4 北上车票</h3><p>当天铁路施工绕行，先核实实际时长与换乘。剑桥和白崖各确认往返两程，并比较往返票和单程票总价。</p><a href="#trains">查看购票入口与上车站</a></article>
              <article className="priority-card"><span>优先级 02</span><h3>伦敦 5 晚＋爱丁堡 3 晚</h3><p>伦敦 9/29 入住、10/4 退房；爱丁堡 10/4 入住、10/7 退房。确认地址、行李寄存和抵达较晚时的入住方式。</p></article>
              <article className="priority-card"><span>优先级 03</span><h3>留好白崖天气余地</h3><p>白崖暂定 10/3，按短线观景准备；遇强风大雨可与伦敦日调换，同时调整门票、火车与公交计划。</p></article>
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
          <div className="section-heading"><div><p className="eyebrow"><MapPinned /> Route map</p><h2>伦敦往返，再北上</h2></div><span className="section-metric">2 处住宿 · 2 次日游</span></div>
          <p className="section-intro">剑桥和白崖分别从伦敦当天往返，10/4 再前往爱丁堡。连线仅示方向；施工绕行、精确车次和站台以运营商当天信息为准。</p>
          <RouteMap />
        </section>

        <section className="section" id="trains">
          <div className="section-heading"><div><p className="eyebrow"><TrainFront /> Rail desk</p><h2>从购票到上车</h2></div><Button variant="ghost" onClick={resetTrainTimes}><RotateCcw /> 恢复暂定时间</Button></div>
          <p className="section-intro">先用 National Rail Journey Planner 查全部车次和票种，选择后会转到铁路公司完成付款；也可以直接在对应运营商官网购买。买完后把下面的暂定时间改成票面时间。</p>
          <article className="rail-buy-guide">
            <div className="rail-buy-title"><TicketCheck /><div><span>推荐购买顺序</span><strong>两次日游往返＋一次北上，共五段行程</strong></div></div>
            <ol>
              <li><b>1</b><span>先确认 10/4 北上施工日的实际行程，再安排剑桥和白崖往返。五段行程不等于必须买五张单程票。</span></li>
              <li><b>2</b><span>日游比较 Return 往返票和两张 Single；确认运营商、适用时段和退改条件。Advance 票通常绑定班次。</span></li>
              <li><b>3</b><span>选择可用的电子票并离线保存；长途列车有座位预约时保存车厢／座位，通勤列车按实际规则乘坐。</span></li>
            </ol>
            <a href="https://www.nationalrail.co.uk/journey-planner/" target="_blank" rel="noreferrer">打开 National Rail <ExternalLink /></a>
          </article>
          <div className="rail-engineering-note"><CircleAlert /><div><strong>10/4 北上：施工绕行已公布</strong><p>Newcastle 至 Edinburgh 海岸线施工，LNER 经 Carlisle 绕行并增加时间。按实际查询留出整天转移，不沿用通常的 4.5 小时或固定海景座位建议。</p><a href={transportSources.engineering} target="_blank" rel="noreferrer">查看 National Rail 官方公告 <ExternalLink /></a></div></div>
          <div className="rail-platform-note"><CircleAlert /><p><strong>站台号不能提前写死。</strong>英国车站会在临近发车时公布或调整站台；到站后按票面时间和终点找大屏，听广播，并用每张卡片里的“当天看站台”。</p></div>
          <div className="train-grid">
            {trains.map((train, index) => (
              <article className="train-card" id={`train-${train.id}`} key={train.id}>
                <div className="train-index">0{index + 1}</div>
                <div className="train-card-top">
                  <div className="train-meta"><span>{train.confirmed ? new Intl.DateTimeFormat('zh-CN', { timeZone: 'Europe/London', month: '2-digit', day: '2-digit', weekday: 'short' }).format(new Date(`${train.local}:00+01:00`)) : train.date}</span><span>{train.note}</span><span>{train.operator}</span></div>
                  <label className="ticket-status" htmlFor={`ticket-${train.id}`}><Checkbox id={`ticket-${train.id}`} checked={tasks[train.taskId]} onCheckedChange={(checked) => updateTask(train.taskId, Boolean(checked))} /><span>{tasks[train.taskId] ? '车票已确认' : '车票待确认'}</span></label>
                </div>
                <h3>{train.route}</h3>
                <div className="station-flow">
                  <div className="station-box"><span>在这里上车</span><strong>{train.from.name} <b>{train.from.code}</b></strong><small>{train.from.address}</small><a href={stationNavigationUrl(train.from)} target="_blank" rel="noreferrer"><Navigation />导航到车站</a></div>
                  <ArrowRight aria-hidden="true" />
                  <div className="station-box"><span>在这里下车</span><strong>{train.to.name} <b>{train.to.code}</b></strong><small>{train.to.address}</small></div>
                </div>
                <div className="train-instructions"><p><TrainFront />{train.routePlan}</p><p><Clock3 />{train.arrive}</p></div>
                <div className="train-timing"><span>{train.confirmed ? '距票面发车' : '距建议出发（未确认车次）'}</span><strong>{formatCountdown(ukTimeToInstant(train.local), now)}</strong></div>
                <div className="train-actions"><a className="buy-train" href={railSearchUrl(train.from.code, train.to.code, train.local)} target="_blank" rel="noreferrer"><TicketCheck />搜索并购票</a><a href={train.operatorUrl} target="_blank" rel="noreferrer">{train.operator} 官网 <ExternalLink /></a><a href={train.liveUrl} target="_blank" rel="noreferrer"><Clock3 />当天看站台</a></div>
                {editingTrain === train.id ? (
                  <div className="train-editor"><label htmlFor={`time-${train.id}`}>英国当地日期和时间</label><input id={`time-${train.id}`} type="datetime-local" value={train.local} onChange={(event) => updateTrain(train.id, event.target.value)} /><Button size="sm" onClick={() => setEditingTrain(null)}>保存</Button></div>
                ) : <Button className="train-time-button" size="sm" variant="outline" onClick={() => setEditingTrain(train.id)}><Pencil /> 改成票面时间</Button>}
              </article>
            ))}
          </div>
          <p className="source-note">路线与运营商信息于 2026-09-19 核对。这里的时间是搜索建议，不代表已订或已核实的具体班次；车票价格、换乘和站台以查询结果为准。日游的两张方向卡共用一项“往返车票已确认”状态。</p>
        </section>

        <LocalTransport />

        <section className="section route-section" id="route">
          <div className="section-heading"><div><p className="eyebrow"><MapPin /> 逐日执行</p><h2>每天留一点余地</h2></div><span className="section-metric">8 晚 · 2 处基地</span></div>
          <p className="section-intro">以下为英国当地时间和建议节奏；点“地图导航”从你的位置出发。白崖暂定 10/3，天气调整后请同步修改预约和往返车票。</p>
          <div className="timeline">
            {days.map((day, index) => {
              const start = new Date(day.start).getTime();
              const end = new Date(day.end).getTime();
              const state = now >= start && now <= end ? 'current' : now > end ? 'past' : 'future';
              return (
                <article className={`day-card ${state}`} key={day.date}>
                  <div className="day-rail" aria-hidden="true"><span>{index + 1}</span></div>
                  <div className="day-body">
                    <header className="day-header"><div><p className="day-date">{day.date} · {day.weekday} · {day.city}</p><h3>{day.title}</h3></div><span className={`state-badge ${state}`}>{state === 'current' ? '今天' : state === 'past' ? '已过日期' : '计划'}</span></header>
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
            <article className="cash-answer"><p className="cash-label">建议兑换现金</p><p className="cash-number">£80</p><p>约 ¥{Math.round(80 * rate)}。准备 £5、£10、£20 小面额即可；其余使用免境外手续费的 Visa / Mastercard。</p><div className="cash-split"><span>现金应急 <strong>£80</strong></span><span>住宿与城际铁路 <strong>另计</strong></span></div></article>
            <article className="budget-card"><h3><WalletCards /> 当地开支预算 · 每人</h3><div className="budget-row"><span>餐饮（9天，含早餐与饮品余量）</span><strong>£300–500</strong></div><div className="budget-row"><span>市内／机场／白崖公交</span><strong>£70–110</strong></div><div className="budget-row"><span>景点</span><strong>£80–140</strong></div><div className="budget-row"><span>杂费与机动</span><strong>£50–90</strong></div><div className="budget-total"><span>合计估算 · 不含住宿和城际火车</span><strong>£500–840</strong></div></article>
            <article className="converter-card"><h3>快速换算</h3><label htmlFor="pounds">英镑金额</label><div className="money-input"><span>£</span><input id="pounds" type="number" min="0" value={pounds} onChange={(event) => setPounds(Number(event.target.value))} /></div><label htmlFor="rate">GBP/CNY 参考汇率</label><div className="money-input"><span>¥</span><input id="rate" type="number" min="0" step="0.01" value={rate} onChange={(event) => setRate(Number(event.target.value))} /></div><p className="converted">≈ ¥{Math.round(pounds * rate).toLocaleString('zh-CN')}</p><small>9.09 仅作手动预算示例，不是实时汇率；可按银行报价修改，实际结算另含点差或手续费。</small></article>
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
          <p className="source-note">餐饮地点和官方营业信息于 2026-09-19 核对；金额为每人餐费预算，不是菜单报价。菜单、营业时间、预约与临时休店以店铺官网为准。</p>
        </section>

        <footer><div><span className="brand-mark">UK</span><strong>Tripboard 2026</strong></div><p>轻装、顺路、留一点余地。</p></footer>
      </div>
    </main>
  );
}
