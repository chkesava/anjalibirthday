// Netlify Function: send-visit.js
// Sends a notification email via SendGrid when invoked.

const sgMail = require('@sendgrid/mail');

exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL; // your email where you want to receive notifications
  const SENDER_EMAIL = process.env.SENDER_EMAIL; // verified sender email (SendGrid)

  if (!SENDGRID_API_KEY || !RECIPIENT_EMAIL || !SENDER_EMAIL) {
    console.error('Missing env vars for send-visit function');
    return { statusCode: 500, body: 'Server misconfigured' };
  }

  sgMail.setApiKey(SENDGRID_API_KEY);

  let payload = {};
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (e) {
    payload = { raw: event.body };
  }

  const subject = `Website event: ${payload.eventType || 'visit'} ${payload.path ? `- ${payload.path}` : ''}`;

  const html = `
    <h3>Website event</h3>
    <p><strong>Type:</strong> ${payload.eventType || 'visit'}</p>
    <p><strong>Path:</strong> ${payload.path || 'unknown'}</p>
    <p><strong>Referrer:</strong> ${payload.referrer || 'none'}</p>
    <p><strong>User agent:</strong> ${payload.ua || 'unknown'}</p>
    <p><strong>Time:</strong> ${new Date(payload.ts || Date.now()).toLocaleString()}</p>
    <pre style="white-space:pre-wrap">${JSON.stringify(payload, null, 2)}</pre>
  `;

  const msg = {
    to: RECIPIENT_EMAIL,
    from: SENDER_EMAIL,
    subject,
    html,
    text: `Event: ${payload.eventType || 'visit'}\nPath: ${payload.path || 'unknown'}\nReferrer: ${payload.referrer || 'none'}\nTime: ${new Date(payload.ts || Date.now()).toLocaleString()}`,
  };

  try {
    await sgMail.send(msg);
    return { statusCode: 200, body: 'OK' };
  } catch (err) {
    console.error('SendGrid error', err?.response?.body || err.message || err);
    return { statusCode: 500, body: 'Failed to send email' };
  }
};
