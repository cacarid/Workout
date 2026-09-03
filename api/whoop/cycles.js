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

  const cyclesResponse = await fetch('https://api.prod.whoop.com/developer/v2/cycle?limit=25', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const cyclesData = await cyclesResponse.json();

  if (!cyclesResponse.ok) {
    response.status(cyclesResponse.status).json(cyclesData);
    return;
  }

  const dailyCycles = (cyclesData.records || []).filter((cycle) => {
    const cycleStart = new Date(cycle.start).getTime();
    const cycleEnd = new Date(cycle.end || cycle.start).getTime();
    return Number.isFinite(cycleStart)
      && Number.isFinite(cycleEnd)
      && cycleStart < dayEnd
      && cycleEnd >= dayStart;
  });

  const currentCycle = dailyCycles.find((cycle) => !cycle.end) || dailyCycles[0];
  const kilojoules = Number(currentCycle && currentCycle.score && currentCycle.score.kilojoule || 0);
  response.status(200).json({
    calories: Math.round(kilojoules * 0.239006),
    cycles: currentCycle ? [currentCycle] : [],
  });
};