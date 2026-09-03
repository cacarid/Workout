const crypto = require('crypto');

const whoopAuthorizeUrl = 'https://api.prod.whoop.com/oauth/oauth2/auth';
const whoopTokenUrl = 'https://api.prod.whoop.com/oauth/oauth2/token';
const whoopScopes = 'read:recovery read:cycles read:sleep read:workout read:profile read:body_measurement';

function getRedirectUri() {
  return process.env.WHOOP_REDIRECT_URI || `${process.env.APP_URL}/oauth-callback.html`;
}

function signState(payload) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', process.env.WHOOP_CLIENT_SECRET).update(encoded).digest('base64url');
  return `${encoded}.${signature}`;
}

function verifyState(state) {
  try {
    const [encoded, signature] = String(state || '').split('.');
    if (!encoded || !signature) return false;

    const expected = crypto.createHmac('sha256', process.env.WHOOP_CLIENT_SECRET).update(encoded).digest('base64url');
    if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;

    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString());
    return Number.isFinite(payload.createdAt) && Date.now() - payload.createdAt < 10 * 60 * 1000;
  } catch {
    return false;
  }
}

function allowCors(response) {
  response.setHeader('Access-Control-Allow-Origin', process.env.APP_URL);
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
}

module.exports = {
  allowCors,
  getRedirectUri,
  signState,
  verifyState,
  whoopAuthorizeUrl,
  whoopScopes,
  whoopTokenUrl,
};