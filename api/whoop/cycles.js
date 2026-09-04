const { allowCors, getCookie, whoopTokenUrl } = require('../_whoop');

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
  if (!dateKey) {
    response.status(401).json({ error: 'WHOOP is not connected' });
    return;
  }

  const refreshToken = getCookie(request, 'whoop_refresh_token');
  if (!refreshToken && !accessToken) {
    response.status(401).json({ error: 'WHOOP is not connected' });
    return;
  }

  let currentAccessToken = accessToken;
  if (refreshToken) {
    const tokenResponse = await fetch(whoopTokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.WHOOP_CLIENT_ID,
        client_secret: process.env.WHOOP_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });
    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) {
      response.status(tokenResponse.status).json(tokenData);
      return;
    }

    currentAccessToken = tokenData.access_token;
    if (tokenData.refresh_token) {
      response.setHeader('Set-Cookie', `whoop_refresh_token=${encodeURIComponent(tokenData.refresh_token)}; Max-Age=31536000; Path=/; HttpOnly; Secure; SameSite=None`);
    }
  }

  const [year, month, day] = dateKey.split('-').map(Number);
  const offsetMs = Number(timezoneOffsetMinutes) * 60 * 1000;
  const dayStart = Date.UTC(year, month - 1, day) + offsetMs;
  const dayEnd = dayStart + 24 * 60 * 60 * 1000;

  const cyclesResponse = await fetch('https://api.prod.whoop.com/developer/v2/cycle?limit=25', {
    headers: { Authorization: `Bearer ${currentAccessToken}` },
  });
  const cyclesData = await cyclesResponse.json();

  if (!cyclesResponse.ok) {
    response.status(cyclesResponse.status).json(cyclesData);
    return;
  }

  const records = cyclesData.records || [];
  const openCycle = records.find((cycle) => !cycle.end);
  const dailyCycles = records.filter((cycle) => {
    const cycleStart = new Date(cycle.start).getTime();
    const cycleEnd = new Date(cycle.end || cycle.start).getTime();
    return Number.isFinite(cycleStart)
      && Number.isFinite(cycleEnd)
      && cycleStart < dayEnd
      && cycleEnd >= dayStart;
  });

  const currentCycle = openCycle || dailyCycles[0];
  const kilojoules = Number(currentCycle && currentCycle.score && currentCycle.score.kilojoule || 0);
  response.status(200).json({
    calories: Math.round(kilojoules * 0.239006),
    cycles: currentCycle ? [currentCycle] : [],
  });
};