const STORAGE_KEY = 'workoutTrackerData';
const hydrationGoalMinOz = 90;
const hydrationGoalMaxOz = 110;
const hydrationGoal = 96;
const hydrationGoalMl = Math.round(hydrationGoal * 29.5735);
const weddingGoalDate = new Date('2026-09-19T00:00:00');

const defaultWorkoutPlan = {
  name: 'Day 1',
  exercises: [
    { id: 'warmup', label: 'Warm-up: 5 min treadmill walk/jog', completed: false, weight: '' },
    { id: 'leg-press', label: 'Leg press — 4 × 10', completed: false, weight: '' },
    { id: 'rdl', label: 'DB Romanian deadlift — 4 × 10', completed: false, weight: '' },
    { id: 'lunges', label: 'Walking lunges — 3 × 12/leg', completed: false, weight: '' },
    { id: 'chest-press', label: 'Chest press — 4 × 10', completed: false, weight: '' },
    { id: 'incline-press', label: 'Incline DB chest press — 3 × 10–12', completed: false, weight: '' },
    { id: 'row', label: 'Seated cable row — 3 × 12', completed: false, weight: '' },
    { id: 'core', label: 'Core circuit — 3 rounds', completed: false, weight: '' },
    { id: 'finish', label: 'Finish: 12 min treadmill intervals', completed: false, weight: '' },
  ],
};

const day2WorkoutPlan = {
  name: 'Day 2',
  exercises: [
    { id: 'day2-warmup', label: 'Treadmill warm-up — 7 min (walk 2 min, easy jog 3 min, walk 1 min, easy jog 1 min)', completed: false, weight: '' },
    { id: 'day2-intervals', label: 'Treadmill intervals — 8 rounds (run 1 min at RPE 8; walk/jog 1 min at RPE 3–4)', completed: false, weight: '' },
    { id: 'day2-db-press', label: 'Incline dumbbell press — 3 × 10–12', completed: false, weight: '' },
    { id: 'day2-pushups', label: 'Push-ups — 3 sets', completed: false, weight: '' },
    { id: 'day2-crunch', label: 'Cable crunch — 3 × 15', completed: false, weight: '' },
    { id: 'day2-knee-raise', label: 'Hanging knee raise or captain\'s-chair raise — 3 × 10–12', completed: false, weight: '' },
    { id: 'day2-pallof', label: 'Pallof press — 3 × 12 per side', completed: false, weight: '' },
    { id: 'day2-cooldown', label: 'Cooldown — 5 min easy walk + calves/hip-flexor stretch', completed: false, weight: '' },
  ],
};

const day3WorkoutPlan = {
  name: 'Day 3',
  exercises: [
    { id: 'day3-warmup', label: 'Warm-up — 6 min (brisk walk 2 min, easy jog 2 min, walk 2 min)', completed: false, weight: '' },
    { id: 'day3-squat', label: 'Back squat or leg press — 4 × 8–10', completed: false, weight: '' },
    { id: 'day3-rdl', label: 'Romanian deadlift — 4 × 8–10', completed: false, weight: '' },
    { id: 'day3-split-squat', label: 'Bulgarian split squat — 3 × 10 per leg', completed: false, weight: '' },
    { id: 'day3-hamstring-curl', label: 'Seated or lying hamstring curl — 3 × 12', completed: false, weight: '' },
    { id: 'day3-walking-lunge', label: 'Walking lunge — 2 × 12 per leg', completed: false, weight: '' },
    { id: 'day3-side-plank', label: 'Side plank — 3 × 30–40 sec per side', completed: false, weight: '' },
    { id: 'day3-dead-bug', label: 'Dead bug — 3 × 10 per side', completed: false, weight: '' },
    { id: 'day3-incline-walk', label: 'Incline treadmill walk — 12–15 min', completed: false, weight: '' },
  ],
};

const day4WorkoutPlan = {
  name: 'Day 4',
  exercises: [
    { id: 'day4-warmup', label: 'Treadmill warm-up — 5 min (walk 1 min, easy jog 3 min, walk 1 min)', completed: false, weight: '' },
    { id: 'day4-chest-press', label: 'Machine chest press — 4 × 8–10', completed: false, weight: '' },
    { id: 'day4-incline-db-press', label: 'Incline dumbbell press — 3 × 10', completed: false, weight: '' },
    { id: 'day4-cable-fly', label: 'Cable fly or pec deck — 3 × 12–15', completed: false, weight: '' },
    { id: 'day4-seated-row', label: 'Seated cable row — 4 × 10–12', completed: false, weight: '' },
    { id: 'day4-lat-pulldown', label: 'Lat pulldown — 3 × 10–12', completed: false, weight: '' },
    { id: 'day4-face-pull', label: 'Face pull — 2 × 15', completed: false, weight: '' },
    { id: 'day4-steady-run', label: 'Steady treadmill run — 15–20 min', completed: false, weight: '' },
    { id: 'day4-cooldown', label: 'Cooldown — 3–5 min walk', completed: false, weight: '' },
  ],
};

function getPlannedWorkoutForDate(date) {
  const dateKey = formatDateKey(typeof date === 'string' ? parseDateKey(date) : new Date(date));

  if (dateKey === '2026-09-01') {
    return defaultWorkoutPlan;
  }

  if (dateKey === '2026-09-02') {
    return day2WorkoutPlan;
  }

  if (dateKey === '2026-09-03') {
    return day3WorkoutPlan;
  }

  if (dateKey === '2026-09-04') {
    return day4WorkoutPlan;
  }

  return null;
}

function normalizeExercise(exercise) {
  if (typeof exercise === 'string') {
    return {
      id: crypto.randomUUID(),
      label: exercise,
      completed: false,
      weight: '',
    };
  }

  return {
    id: exercise.id || crypto.randomUUID(),
    label: exercise.label || '',
    completed: Boolean(exercise.completed),
    weight: exercise.weight || '',
  };
}

function createDefaultCalendarEntry(date = new Date()) {
  const dateKey = formatDateKey(date);
  const plannedWorkout = getPlannedWorkoutForDate(dateKey);

  return {
    workoutName: plannedWorkout ? plannedWorkout.name : '',
    exercises: plannedWorkout ? plannedWorkout.exercises.map(normalizeExercise) : [],
    completed: false,
    date: dateKey,
  };
}

const defaultState = {
  meals: [],
  workouts: [],
  water: [],
  weights: [
    { id: crypto.randomUUID(), value: 195, time: '05:30' },
  ],
  calendar: {
    [formatDateKey(new Date('2026-09-01T00:00:00'))]: {
      workoutName: defaultWorkoutPlan.name,
      exercises: defaultWorkoutPlan.exercises.map(normalizeExercise),
      completed: false,
      date: formatDateKey(new Date('2026-09-01T00:00:00')),
    },
    [formatDateKey(new Date('2026-09-02T00:00:00'))]: {
      workoutName: day2WorkoutPlan.name,
      exercises: day2WorkoutPlan.exercises.map(normalizeExercise),
      completed: false,
      date: formatDateKey(new Date('2026-09-02T00:00:00')),
    },
    [formatDateKey(new Date('2026-09-03T00:00:00'))]: {
      workoutName: day3WorkoutPlan.name,
      exercises: day3WorkoutPlan.exercises.map(normalizeExercise),
      completed: false,
      date: formatDateKey(new Date('2026-09-03T00:00:00')),
    },
    [formatDateKey(new Date('2026-09-04T00:00:00'))]: {
      workoutName: day4WorkoutPlan.name,
      exercises: day4WorkoutPlan.exercises.map(normalizeExercise),
      completed: false,
      date: formatDateKey(new Date('2026-09-04T00:00:00')),
    },
  },
};

const state = loadState();
let currentMonthDate = parseDateKey('2026-09-01');
let currentSelectedDate = '2026-09-01';

if (!state.calendar['2026-09-01']) {
  state.calendar = structuredClone(defaultState.calendar);
  currentSelectedDate = '2026-09-01';
  currentMonthDate = parseDateKey('2026-09-01');
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const todayDate = document.getElementById('todayDate');
const weddingCountdown = document.getElementById('weddingCountdown');
const mealForm = document.getElementById('mealForm');
const workoutForm = document.getElementById('workoutForm');
const waterForm = document.getElementById('waterForm');
const weightForm = document.getElementById('weightForm');
const calendarGrid = document.getElementById('calendarGrid');
const calendarMonthLabel = document.getElementById('calendarMonthLabel');
const selectedWorkoutLabel = document.getElementById('selectedWorkoutLabel');
const selectedWorkoutStatus = document.getElementById('selectedWorkoutStatus');
const selectedWorkoutItems = document.getElementById('selectedWorkoutItems');
const newExerciseInput = document.getElementById('newExerciseInput');
const addExerciseBtn = document.getElementById('addExerciseBtn');
const prevMonthBtn = document.getElementById('prevMonthBtn');
const nextMonthBtn = document.getElementById('nextMonthBtn');
const todayButton = document.getElementById('todayButton');
const visualLogDialog = document.getElementById('visualLogDialog');
const visualLogTitle = document.getElementById('visualLogTitle');
const visualLogSubtitle = document.getElementById('visualLogSubtitle');
const visualLogList = document.getElementById('visualLogList');
const closeVisualLogBtn = document.getElementById('closeVisualLogBtn');
const connectWhoopBtn = document.getElementById('connectWhoopBtn');
const refreshPageBtn = document.getElementById('refreshPageBtn');
const whoopApiBaseUrl = 'https://workout-tau-lake.vercel.app';

const elements = {
  waterTotal: document.getElementById('waterTotal'),
  waterProgressLabel: document.getElementById('waterProgressLabel'),
  hydrationProgress: document.getElementById('hydrationProgress'),
  hydrationGoalText: document.getElementById('hydrationGoalText'),
  mealCount: document.getElementById('mealCount'),
  workoutCount: document.getElementById('workoutCount'),
  caloriesBurned: document.getElementById('caloriesBurned'),
  weightValue: document.getElementById('weightValue'),
};

function normalizeCalendarState(calendar) {
  const normalized = {};
  const planDates = ['2026-09-01', '2026-09-02', '2026-09-03', '2026-09-04'];

  planDates.forEach((dateKey) => {
    const existing = calendar && calendar[dateKey];
    const plannedWorkout = getPlannedWorkoutForDate(dateKey);

    if (plannedWorkout) {
      normalized[dateKey] = existing && Array.isArray(existing.exercises)
        ? {
            ...existing,
            workoutName: plannedWorkout.name,
            exercises: existing.exercises.map(normalizeExercise),
            date: dateKey,
          }
        : {
            workoutName: plannedWorkout.name,
            exercises: plannedWorkout.exercises.map(normalizeExercise),
            completed: false,
            date: dateKey,
          };
    }
  });

  return normalized;
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return structuredClone(defaultState);
  }

  try {
    const parsed = JSON.parse(saved);
    const cleanedCalendar = normalizeCalendarState(parsed.calendar && typeof parsed.calendar === 'object' ? parsed.calendar : {});
    const hasPlannedStart = Object.prototype.hasOwnProperty.call(cleanedCalendar, '2026-09-01');

    if (!hasPlannedStart) {
      return structuredClone(defaultState);
    }

    return {
      meals: Array.isArray(parsed.meals) ? parsed.meals : [],
      workouts: Array.isArray(parsed.workouts) ? parsed.workouts : [],
      water: Array.isArray(parsed.water) ? parsed.water : [],
      weights: Array.isArray(parsed.weights) ? parsed.weights : [{ id: crypto.randomUUID(), value: 195, time: '05:30' }],
      calendar: cleanedCalendar,
    };
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function isPastDate(dateKey) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return parseDateKey(dateKey) < today;
}

function formatDate() {
  const options = { weekday: 'long', month: 'short', day: 'numeric' };
  todayDate.textContent = new Date().toLocaleDateString(undefined, options);
}

function updateWeddingCountdown() {
  const now = new Date();
  const diffMs = weddingGoalDate - now;
  const dayInMs = 1000 * 60 * 60 * 24;
  const daysLeft = Math.max(0, Math.ceil(diffMs / dayInMs));

  if (daysLeft === 0) {
    weddingCountdown.textContent = 'Wedding day!';
    return;
  }

  weddingCountdown.textContent = `${daysLeft} days`;
}

function ozToMl(oz) {
  return oz * 29.5735;
}

function formatOunces(ozValue) {
  if (ozValue >= 10) {
    return `${Math.round(ozValue)} oz`;
  }

  return `${Number(ozValue).toFixed(1).replace(/\.0$/, '')} oz`;
}

function getTodaysWaterEntries() {
  const todayKey = formatDateKey(new Date());
  return state.water.filter((entry) => (entry.date || todayKey) === todayKey);
}

function getHydrationProgress() {
  const total = getTodaysWaterEntries().reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  return Math.min((total / hydrationGoal) * 100, 100);
}

function renderSummary() {
  const totalWater = getTodaysWaterEntries().reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  const totalWorkoutCalories = state.workouts.reduce((sum, entry) => sum + Number(entry.calories || 0), 0);
  const mealCount = state.meals.length;
  const workoutCount = state.workouts.length;
  const latestWeight = state.weights.length ? state.weights[state.weights.length - 1].value : 195;

  const progressPct = Math.min((totalWater / hydrationGoal) * 100, 100);

  elements.waterTotal.textContent = formatOunces(totalWater);
  elements.waterProgressLabel.textContent = `${Math.round(progressPct)}%`;
  elements.hydrationProgress.style.width = `${progressPct}%`;
  elements.hydrationGoalText.textContent = `${hydrationGoalMinOz}–${hydrationGoalMaxOz} oz / day`;
  elements.mealCount.textContent = mealCount;
  elements.workoutCount.textContent = workoutCount;
  elements.weightValue.textContent = `${latestWeight} lb`;
  elements.caloriesBurned.textContent = totalWorkoutCalories;
}

function createEntryRow({ name, details, tag, onDelete, kind }) {
  const li = document.createElement('li');
  li.className = 'entry-item';

  const main = document.createElement('div');
  main.className = 'entry-main';
  main.innerHTML = `<strong>${name}</strong><span>${details}</span>`;

  const meta = document.createElement('div');
  meta.className = 'entry-meta';

  const tagEl = document.createElement('span');
  tagEl.className = 'entry-tag';
  tagEl.textContent = tag;

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.type = 'button';
  deleteBtn.textContent = 'Delete';
  deleteBtn.addEventListener('click', onDelete);

  meta.append(tagEl, deleteBtn);
  li.append(main, meta);
  return li;
}

function renderVisualLog(type) {
  const logConfig = {
    meal: { title: 'Meal log', subtitle: 'Every completed meal, newest first.', entries: state.meals },
    water: { title: 'Water log', subtitle: 'Every water entry, newest first.', entries: state.water },
    weight: { title: 'Weight log', subtitle: 'Your morning weigh-ins, newest first.', entries: state.weights },
  }[type];
  const entries = [...logConfig.entries].reverse();
  visualLogTitle.textContent = logConfig.title;
  visualLogSubtitle.textContent = logConfig.subtitle;
  visualLogList.innerHTML = '';

  if (!entries.length) {
    visualLogList.innerHTML = `<li class="empty-state">No ${type === 'meal' ? 'meals' : type === 'water' ? 'water' : 'weigh-ins'} logged yet.</li>`;
  } else {
    entries.forEach((entry) => {
      const item = document.createElement('li');
      item.className = 'entry-item';
      const dateText = entry.date ? ` · ${parseDateKey(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}` : '';
      const name = type === 'meal' ? `${entry.type} meal complete` : type === 'water' ? formatOunces(entry.amount) : `${entry.value} lb`;
      const details = type === 'meal' ? 'Completed' : type === 'water' ? 'Logged' : 'Morning weigh-in';
      const tag = type === 'meal' ? entry.type : type === 'water' ? formatOunces(entry.amount) : 'Morning';
      item.innerHTML = `<div class="entry-main"><strong>${name}</strong><span>${details}${dateText} at ${entry.time}</span></div><span class="entry-tag">${tag}</span>`;
      visualLogList.appendChild(item);
    });
  }

  visualLogDialog.showModal();
}

function ensureCalendarEntry(dateKey) {
  if (!state.calendar) {
    state.calendar = {};
  }

  const plannedWorkout = getPlannedWorkoutForDate(dateKey);

  if (!state.calendar[dateKey] && plannedWorkout) {
    state.calendar[dateKey] = createDefaultCalendarEntry(parseDateKey(dateKey));
  }

  if (!state.calendar[dateKey] && !plannedWorkout) {
    state.calendar[dateKey] = {
      workoutName: '',
      exercises: [],
      completed: false,
      date: dateKey,
    };
  }

  if (state.calendar[dateKey] && Array.isArray(state.calendar[dateKey].exercises)) {
    state.calendar[dateKey].exercises = state.calendar[dateKey].exercises.map(normalizeExercise);
  }

  return state.calendar[dateKey];
}

function renderCalendar() {
  const monthDate = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), 1);
  const monthLabel = monthDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  calendarMonthLabel.textContent = monthLabel;

  const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const lastDay = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
  const startWeekday = firstDay.getDay();
  const totalDays = lastDay.getDate();

  calendarGrid.innerHTML = '';

  for (let i = 0; i < startWeekday; i += 1) {
    const spacer = document.createElement('div');
    spacer.className = 'calendar-day empty-day';
    calendarGrid.appendChild(spacer);
  }

  for (let day = 1; day <= totalDays; day += 1) {
    const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
    const dateKey = formatDateKey(date);
    const entry = ensureCalendarEntry(dateKey);

    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'calendar-day' + (entry.completed ? ' complete' : '') + (formatDateKey(new Date()) === dateKey ? ' today' : '');
    cell.style.opacity = entry.exercises.length || entry.workoutName ? '1' : '0.35';
    cell.innerHTML = `<span>${day}</span>`;
    cell.addEventListener('click', () => {
      currentSelectedDate = dateKey;
      openCalendarDay(dateKey);
    });
    calendarGrid.appendChild(cell);
  }

  openCalendarDay(currentSelectedDate || formatDateKey(new Date()));
}

function openCalendarDay(dateKey) {
  currentSelectedDate = dateKey;
  const entry = ensureCalendarEntry(dateKey);
  const readOnly = isPastDate(dateKey);

  const displayDate = parseDateKey(dateKey);
  const labelText = entry.workoutName
    ? `${displayDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} · ${readOnly ? 'Daily log' : entry.workoutName}`
    : `${displayDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} · No workout planned`;
  selectedWorkoutLabel.textContent = labelText;
  selectedWorkoutStatus.textContent = readOnly ? 'Past workouts are saved as read-only logs.' : '';
  selectedWorkoutStatus.hidden = !readOnly;
  workoutForm.querySelector('button[type="submit"]').disabled = readOnly || !entry.exercises.length;
  addExerciseBtn.disabled = readOnly;
  newExerciseInput.disabled = readOnly;
  selectedWorkoutItems.innerHTML = '';

  if (!entry.exercises.length) {
    selectedWorkoutItems.innerHTML = '<p class="empty-state small">No workout planned for this day.</p>';
    return;
  }

  entry.exercises.forEach((exercise) => {
    const row = document.createElement('div');
    row.className = 'check-item';

    const checkboxWrapper = document.createElement('label');
    checkboxWrapper.className = 'check-toggle';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = Boolean(exercise.completed);
    checkbox.disabled = readOnly;

    const text = document.createElement('span');
    text.textContent = exercise.label;

    const weightInput = document.createElement('input');
    weightInput.type = 'number';
    weightInput.placeholder = 'lb';
    weightInput.value = exercise.weight || '';
    weightInput.className = 'exercise-weight-input';
    weightInput.disabled = readOnly;

    checkbox.addEventListener('change', () => {
      if (readOnly) return;
      exercise.completed = checkbox.checked;
      entry.completed = entry.exercises.every((item) => item.completed);
      state.calendar[dateKey] = entry;
      saveState();
      render();
    });

    weightInput.addEventListener('input', () => {
      if (readOnly) return;
      exercise.weight = weightInput.value;
      state.calendar[dateKey] = entry;
      saveState();
    });

    checkboxWrapper.append(checkbox, text);
    row.append(checkboxWrapper, weightInput);
    selectedWorkoutItems.appendChild(row);
  });
}

function render() {
  renderSummary();
  renderCalendar();
}

document.querySelectorAll('.meal-check-btn').forEach((button) => {
  button.addEventListener('click', () => {
    const type = button.dataset.mealType;
    if (!type) return;

    state.meals.push({
      id: crypto.randomUUID(),
      name: `${type} meal`,
      calories: 0,
      type,
      date: formatDateKey(new Date()),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    saveState();
    render();
  });
});

workoutForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (isPastDate(currentSelectedDate)) return;

  const entry = ensureCalendarEntry(currentSelectedDate);
  entry.completed = true;
  state.calendar[currentSelectedDate] = entry;

  saveState();
  render();
});

addExerciseBtn.addEventListener('click', () => {
  if (isPastDate(currentSelectedDate)) return;

  const text = newExerciseInput.value.trim();
  if (!text) return;

  const entry = ensureCalendarEntry(currentSelectedDate);
  entry.exercises.push({
    id: crypto.randomUUID(),
    label: text,
    completed: false,
    weight: '',
  });
  state.calendar[currentSelectedDate] = entry;
  newExerciseInput.value = '';
  saveState();
  render();
});

waterForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(waterForm);
  const amount = Number(formData.get('waterAmount'));

  if (!amount || amount <= 0) {
    return;
  }

  state.water.push({
    id: crypto.randomUUID(),
    amount,
    date: formatDateKey(new Date()),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });

  saveState();
  waterForm.reset();
  render();
});

weightForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(weightForm);
  const value = Number(formData.get('weightValue'));

  if (!value || value <= 0) {
    return;
  }

  state.weights.push({
    id: crypto.randomUUID(),
    value,
    date: formatDateKey(new Date()),
    time: '05:30',
  });

  saveState();
  render();
});

document.querySelectorAll('.log-launcher').forEach((launcher) => {
  const openLog = () => renderVisualLog(launcher.dataset.log);
  launcher.addEventListener('click', openLog);
  launcher.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openLog();
    }
  });
});

connectWhoopBtn.addEventListener('click', () => {
  window.location.href = `${whoopApiBaseUrl}/api/whoop/authorize`;
});

refreshPageBtn.addEventListener('click', () => {
  window.location.reload();
});

closeVisualLogBtn.addEventListener('click', () => visualLogDialog.close());

visualLogDialog.addEventListener('click', (event) => {
  if (event.target === visualLogDialog) visualLogDialog.close();
});

document.querySelectorAll('.quick-water').forEach((button) => {
  button.addEventListener('click', () => {
    const amount = Number(button.dataset.amount);

    state.water.push({
      id: crypto.randomUUID(),
      amount,
      date: formatDateKey(new Date()),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    saveState();
    render();
  });
});

prevMonthBtn.addEventListener('click', () => {
  currentMonthDate = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1);
  renderCalendar();
});

nextMonthBtn.addEventListener('click', () => {
  currentMonthDate = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1);
  renderCalendar();
});

todayButton.addEventListener('click', () => {
  currentMonthDate = new Date();
  currentSelectedDate = formatDateKey(new Date());
  renderCalendar();
});

formatDate();
updateWeddingCountdown();
render();
