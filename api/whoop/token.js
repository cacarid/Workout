const { allowCors, getRedirectUri, verifyState, whoopTokenUrl } = require('../_whoop');

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

  const { code, state } = request.body || {};
  if (!code || !verifyState(state)) {
    response.status(400).json({ error: 'Invalid authorization response' });
    return;
  }

  const tokenResponse = await fetch(whoopTokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.WHOOP_CLIENT_ID,
      client_secret: process.env.WHOOP_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: getRedirectUri(),
    }),
  });

  const tokenData = await tokenResponse.json();
  response.status(tokenResponse.status).json(tokenData);
};