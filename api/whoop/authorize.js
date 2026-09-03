const crypto = require('crypto');
const { getRedirectUri, signState, whoopAuthorizeUrl, whoopScopes } = require('../_whoop');

module.exports = (request, response) => {
  if (!process.env.WHOOP_CLIENT_ID || !process.env.WHOOP_CLIENT_SECRET || !process.env.APP_URL) {
    response.status(500).send('WHOOP integration is not configured.');
    return;
  }

  const state = signState({ createdAt: Date.now(), nonce: crypto.randomUUID() });
  const params = new URLSearchParams({
    client_id: process.env.WHOOP_CLIENT_ID,
    redirect_uri: getRedirectUri(),
    response_type: 'code',
    scope: whoopScopes,
    state,
  });

  response.redirect(`${whoopAuthorizeUrl}?${params}`);
};