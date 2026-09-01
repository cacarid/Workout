const STORAGE_KEY = 'workoutTrackerData';
const hydrationGoal = 2000;
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
  return {
    workoutName: defaultWorkoutPlan.name,
    exercises: defaultWorkoutPlan.exercises.map(normalizeExercise),
    completed: false,
    date: formatDateKey(date),
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
      exercises: [...defaultWorkoutPlan.exercises],
      completed: false,
      date: formatDateKey(new Date('2026-09-01T00:00:00')),
    },
  },
};

const state = loadState();
let currentMonthDate = new Date();
let currentSelectedDate = formatDateKey(new Date());

const todayDate = document.getElementById('todayDate');
const weddingCountdown = document.getElementById('weddingCountdown');
const mealForm = document.getElementById('mealForm');
const workoutForm = document.getElementById('workoutForm');
const waterForm = document.getElementById('waterForm');
const weightForm = document.getElementById('weightForm');
const mealList = document.getElementById('mealList');
const workoutList = document.getElementById('workoutList');
const waterList = document.getElementById('waterList');
const weightList = document.getElementById('weightList');
const calendarGrid = document.getElementById('calendarGrid');
const calendarMonthLabel = document.getElementById('calendarMonthLabel');
const selectedWorkoutLabel = document.getElementById('selectedWorkoutLabel');
const selectedWorkoutItems = document.getElementById('selectedWorkoutItems');
const newExerciseInput = document.getElementById('newExerciseInput');
const addExerciseBtn = document.getElementById('addExerciseBtn');
const prevMonthBtn = document.getElementById('prevMonthBtn');
const nextMonthBtn = document.getElementById('nextMonthBtn');
const todayButton = document.getElementById('todayButton');

const elements = {
  waterTotal: document.getElementById('waterTotal'),
  waterProgressLabel: document.getElementById('waterProgressLabel'),
  hydrationProgress: document.getElementById('hydrationProgress'),
  hydrationGoalText: document.getElementById('hydrationGoalText'),
  mealCount: document.getElementById('mealCount'),
  workoutCount: document.getElementById('workoutCount'),
  caloriesBurned: document.getElementById('caloriesBurned'),
  weightValue: document.getElementById('weightValue'),
  mealSummary: document.getElementById('mealSummary'),
  workoutSummary: document.getElementById('workoutSummary'),
  waterSummary: document.getElementById('waterSummary'),
  weightSummary: document.getElementById('weightSummary'),
};

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return structuredClone(defaultState);
  }

  try {
    const parsed = JSON.parse(saved);
    return {
      meals: Array.isArray(parsed.meals) ? parsed.meals : [],
      workouts: Array.isArray(parsed.workouts) ? parsed.workouts : [],
      water: Array.isArray(parsed.water) ? parsed.water : [],
      weights: Array.isArray(parsed.weights) ? parsed.weights : [{ id: crypto.randomUUID(), value: 195, time: '05:30' }],
      calendar: parsed.calendar && typeof parsed.calendar === 'object' ? parsed.calendar : { [formatDateKey(new Date())]: createDefaultCalendarEntry() },
    };
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function formatDateKey(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString().slice(0, 10);
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

function waterToLiters(ml) {
  return (ml / 1000).toFixed(1);
}

function getHydrationProgress() {
  const total = state.water.reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  return Math.min((total / hydrationGoal) * 100, 100);
}

function renderSummary() {
  const totalWater = state.water.reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  const totalWorkoutCalories = state.workouts.reduce((sum, entry) => sum + Number(entry.calories || 0), 0);
  const mealCount = state.meals.length;
  const workoutCount = state.workouts.length;
  const latestWeight = state.weights.length ? state.weights[state.weights.length - 1].value : 195;

  const progressPct = Math.min((totalWater / hydrationGoal) * 100, 100);

  elements.waterTotal.textContent = `${waterToLiters(totalWater)} L`;
  elements.waterProgressLabel.textContent = `${Math.round(progressPct)}%`;
  elements.hydrationProgress.style.width = `${progressPct}%`;
  elements.hydrationGoalText.textContent = `${waterToLiters(totalWater)} L / ${waterToLiters(hydrationGoal)} L`;
  elements.mealCount.textContent = mealCount;
  elements.workoutCount.textContent = workoutCount;
  elements.weightValue.textContent = `${latestWeight} lb`;
  elements.caloriesBurned.textContent = totalWorkoutCalories;
  elements.mealSummary.textContent = `${mealCount} meal${mealCount === 1 ? '' : 's'}`;
  elements.workoutSummary.textContent = `${workoutCount} session${workoutCount === 1 ? '' : 's'}`;
  elements.waterSummary.textContent = `${state.water.length} ${state.water.length === 1 ? 'glass' : 'glasses'}`;
  elements.weightSummary.textContent = `${state.weights.length} ${state.weights.length === 1 ? 'entry' : 'entries'}`;
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

function renderMeals() {
  mealList.innerHTML = '';

  if (!state.meals.length) {
    mealList.innerHTML = '<li class="empty-state">No meal check-ins yet.</li>';
    return;
  }

  [...state.meals]
    .reverse()
    .forEach((meal) => {
      const item = createEntryRow({
        name: `${meal.type} meal complete`,
        details: `Checked at ${meal.time}`,
        tag: meal.type,
        kind: 'meal',
        onDelete: () => {
          state.meals = state.meals.filter((entry) => entry.id !== meal.id);
          saveState();
          render();
        },
      });
      mealList.appendChild(item);
    });
}

function renderWorkouts() {
  workoutList.innerHTML = '';

  const calendarEntries = Object.values(state.calendar || {});
  const completedDates = calendarEntries.filter((entry) => entry.completed).length;

  if (!completedDates) {
    workoutList.innerHTML = '<li class="empty-state">No workouts logged yet.</li>';
    return;
  }

  Object.entries(state.calendar || {})
    .filter(([, entry]) => entry.completed)
    .reverse()
    .forEach(([date, workout]) => {
      const item = createEntryRow({
        name: workout.workoutName || 'Workout',
        details: `${new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} · ${workout.exercises.length} items`,
        tag: 'Done',
        onDelete: () => {
          if (state.calendar[date]) {
            state.calendar[date].completed = false;
          }
          saveState();
          render();
        },
      });
      workoutList.appendChild(item);
    });
}

function renderWater() {
  waterList.innerHTML = '';

  if (!state.water.length) {
    waterList.innerHTML = '<li class="empty-state">No water logged yet.</li>';
    return;
  }

  [...state.water]
    .reverse()
    .forEach((entry) => {
      const item = createEntryRow({
        name: `${entry.amount} ml`,
        details: `Logged at ${entry.time}`,
        tag: `${(entry.amount / 1000).toFixed(1)} L`,
        onDelete: () => {
          state.water = state.water.filter((waterEntry) => waterEntry.id !== entry.id);
          saveState();
          render();
        },
      });
      waterList.appendChild(item);
    });
}

function renderWeights() {
  weightList.innerHTML = '';

  if (!state.weights.length) {
    weightList.innerHTML = '<li class="empty-state">No weigh-ins logged yet.</li>';
    return;
  }

  [...state.weights]
    .reverse()
    .forEach((entry) => {
      const item = createEntryRow({
        name: `${entry.value} lb`,
        details: `Logged at ${entry.time}`,
        tag: 'Morning',
        onDelete: () => {
          state.weights = state.weights.filter((weightEntry) => weightEntry.id !== entry.id);
          saveState();
          render();
        },
      });
      weightList.appendChild(item);
    });
}

function ensureCalendarEntry(dateKey) {
  if (!state.calendar) {
    state.calendar = {};
  }

  const plannedStart = formatDateKey(new Date('2026-09-01T00:00:00'));
  const isStartDate = dateKey === plannedStart;

  if (!state.calendar[dateKey] && isStartDate) {
    state.calendar[dateKey] = createDefaultCalendarEntry(new Date(dateKey));
  }

  if (!state.calendar[dateKey] && !isStartDate) {
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

  const labelText = entry.workoutName ? `${new Date(dateKey).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} · ${entry.workoutName}` : `${new Date(dateKey).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} · No workout planned`;
  selectedWorkoutLabel.textContent = labelText;
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

    const text = document.createElement('span');
    text.textContent = exercise.label;

    const weightInput = document.createElement('input');
    weightInput.type = 'number';
    weightInput.placeholder = 'lb';
    weightInput.value = exercise.weight || '';
    weightInput.className = 'exercise-weight-input';

    checkbox.addEventListener('change', () => {
      exercise.completed = checkbox.checked;
      entry.completed = entry.exercises.every((item) => item.completed);
      state.calendar[dateKey] = entry;
      saveState();
      render();
    });

    weightInput.addEventListener('input', () => {
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
  renderMeals();
  renderWorkouts();
  renderWater();
  renderWeights();
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
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    saveState();
    render();
  });
});

workoutForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const entry = ensureCalendarEntry(currentSelectedDate);
  entry.completed = true;
  state.calendar[currentSelectedDate] = entry;

  saveState();
  render();
});

addExerciseBtn.addEventListener('click', () => {
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
    time: '05:30',
  });

  saveState();
  render();
});

document.querySelectorAll('.quick-water').forEach((button) => {
  button.addEventListener('click', () => {
    const amount = Number(button.dataset.amount);

    state.water.push({
      id: crypto.randomUUID(),
      amount,
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
