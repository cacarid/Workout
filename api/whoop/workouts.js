const { allowCors } = require('../_whoop');

module.exports = async (request, response) => {
  allowCors(response);
  if (request.method === 'OPTIONS') {
    response.status(204).end();
    return;
  }

  if (request.method !== 'POST') {
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { accessToken, dateKey, timezoneOffsetMinutes = 0 } = request.body || {};
  if (!accessToken || !dateKey) {
    response.status(401).json({ error: 'WHOOP is not connected' });
    return;
  }

  const [year, month, day] = dateKey.split('-').map(Number);
  const offsetMs = Number(timezoneOffsetMinutes) * 60 * 1000;
  const dayStart = Date.UTC(year, month - 1, day) + offsetMs;
  const dayEnd = dayStart + 24 * 60 * 60 * 1000;

  const workoutsResponse = await fetch('https://api.prod.whoop.com/developer/v2/activity/workout?limit=25', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const workoutsData = await workoutsResponse.json();
  if (!workoutsResponse.ok) {
    response.status(workoutsResponse.status).json(workoutsData);
    return;
  }

  const dailyWorkouts = (workoutsData.records || []).filter((workout) => {
    const workoutStart = new Date(workout.start);
    const workoutEnd = new Date(workout.end || workout.start);
    const startTime = workoutStart.getTime();
    const endTime = workoutEnd.getTime();
    return Number.isFinite(startTime)
      && Number.isFinite(endTime)
      && startTime < dayEnd
      && endTime >= dayStart;
  });

  const calories = dailyWorkouts.reduce((total, workout) => {
    const score = workout.score || {};
    const directCalories = Number(score.calories || score.calorie);
    if (Number.isFinite(directCalories)) return total + directCalories;

    const kilojoules = Number(score.kilojoule);
    return total + (Number.isFinite(kilojoules) ? kilojoules * 0.239006 : 0);
  }, 0);

  response.status(200).json({ calories: Math.round(calories), workouts: dailyWorkouts });
};