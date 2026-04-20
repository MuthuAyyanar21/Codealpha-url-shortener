const express = require('express');
const Database = require('better-sqlite3');
const crypto = require('crypto');
const path = require('path');

const app = express();
const db = new Database('urls.db');

// Init DB
db.exec(`
  CREATE TABLE IF NOT EXISTS urls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    short_code TEXT UNIQUE NOT NULL,
    original_url TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    visits INTEGER DEFAULT 0
  )
`);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Optional: simple frontend
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>URL Shortener</title>
      <style>
        body { font-family: sans-serif; max-width: 600px; margin: 60px auto; padding: 0 20px; }
        input { width: 100%; padding: 10px; font-size: 16px; margin: 8px 0; box-sizing: border-box; }
        button { padding: 10px 24px; background: #4f46e5; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; }
        #result { margin-top: 20px; padding: 12px; background: #f0fdf4; border-radius: 6px; display: none; }
        a { color: #4f46e5; }
      </style>
    </head>
    <body>
      <h1>🔗 URL Shortener</h1>
      <input type="text" id="urlInput" placeholder="Enter a long URL..." />
      <button onclick="shorten()">Shorten</button>
      <div id="result"></div>
      <script>
        async function shorten() {
          const url = document.getElementById('urlInput').value;
          const res = await fetch('/api/shorten', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
          });
          const data = await res.json();
          if (data.short_url) {
            document.getElementById('result').style.display = 'block';
            document.getElementById('result').innerHTML =
              'Short URL: <a href="' + data.short_url + '" target="_blank">' + data.short_url + '</a>';
          } else {
            alert(data.error || 'Something went wrong');
          }
        }
      </script>
    </body>
    </html>
  `);
});

// POST /api/shorten — create short URL
app.post('/api/shorten', (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  // Basic URL validation
  try { new URL(url); } catch {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  const short_code = crypto.randomBytes(4).toString('hex'); // e.g. "a3f9c2b1"
  try {
    db.prepare('INSERT INTO urls (short_code, original_url) VALUES (?, ?)').run(short_code, url);
    return res.status(201).json({
      short_code,
      short_url: `${req.protocol}://${req.get('host')}/${short_code}`,
      original_url: url
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create short URL' });
  }
});

// GET /:code — redirect to original URL
app.get('/:code', (req, res) => {
  const row = db.prepare('SELECT * FROM urls WHERE short_code = ?').get(req.params.code);
  if (!row) return res.status(404).json({ error: 'Short URL not found' });

  db.prepare('UPDATE urls SET visits = visits + 1 WHERE id = ?').run(row.id);
  res.redirect(301, row.original_url);
});

// GET /api/stats/:code — view stats
app.get('/api/stats/:code', (req, res) => {
  const row = db.prepare('SELECT * FROM urls WHERE short_code = ?').get(req.params.code);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(row);
});

// GET /api/all — list all URLs
app.get('/api/all', (req, res) => {
  const rows = db.prepare('SELECT * FROM urls ORDER BY created_at DESC').all();
  res.json(rows);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Task 1 — URL Shortener running on http://localhost:${PORT}`));
