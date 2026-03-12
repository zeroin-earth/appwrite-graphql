import { setTimeout as delay } from 'node:timers/promises';

export default async function ({ req, res }) {
  if (req.path === '/long') {
    await delay(5000);
    return res.text('This response was delayed by 5 seconds');
  }

  if (req.path === '/error') {
    return res.status(500).text('This is an error response');
  }

  if (req.path === '/json') {
    return res.json({ message: 'This is a JSON response' });
  }

  return res.text('Invalid path');
}