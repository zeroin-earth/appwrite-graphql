/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const http = require('http')

const messages = []

const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let body = ''
    req.on('data', (chunk) => (body += chunk))
    req.on('end', () => {
      try {
        const msg = JSON.parse(body)
        messages.push({ ...msg, timestamp: Date.now() })
        console.log(`SMS to ${msg.to}: ${msg.message}`)
      } catch {
        messages.push({ raw: body, timestamp: Date.now() })
      }
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ ok: true }))
    })
  } else if (req.method === 'GET' && req.url === '/messages') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(messages.sort((a, b) => b.timestamp - a.timestamp)))
  } else if (req.method === 'GET' && req.url.startsWith('/messages/')) {
    const phone = decodeURIComponent(req.url.slice('/messages/'.length))
    const filtered = messages.filter((m) => m.to?.includes(phone))
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(filtered.sort((a, b) => b.timestamp - a.timestamp)))
  } else if (req.method === 'DELETE' && req.url === '/messages') {
    messages.length = 0
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ ok: true }))
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ status: 'sms-mock running', count: messages.length }))
  }
})

server.listen(5000, '0.0.0.0', () => console.log('SMS mock catcher listening on :5000'))
