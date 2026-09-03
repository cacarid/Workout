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

  const { accessToken } = request.body || {};
  if (!accessToken) {
    response.status(401).json({ error: 'WHOOP is not connected' });
    return;
  }

  const workoutsResponse = await fetch('https://api.prod.whoop.com/developer/v2/activity/workout?limit=25', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const workoutsData = await workoutsResponse.json();
  if (!workoutsResponse.ok) {
    response.status(workoutsResponse.status).json(workoutsData);
    return;
  }

  const calories = (workoutsData.records || []).reduce((total, workout) => {
    const kilojoules = Number(workout.score && workout.score.kilojoule);
    return total + (Number.isFinite(kilojoules) ? kilojoules * 0.239006 : 0);
  }, 0);

  response.status(200).json({ calories: Math.round(calories), workouts: workoutsData.records || [] });
};