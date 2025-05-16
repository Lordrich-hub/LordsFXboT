const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { keltner, donchian, tsi, cmo } = require('./indicators');

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = '46527b292f154433a6b8e2205c7d4d65';
const BASE_URL = 'https://api.12data.com/time_series';

// List of pairs (limit to ~10-12 for API quota)
const PAIRS = [
  'EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD',
  'USD/CAD', 'NZD/USD', 'EUR/JPY', 'GBP/JPY', 'EUR/GBP',
];

const TIMEFRAMES = ['1min', '5min', '15min', '30min', '1h', '4h', '1day'];

app.get('/pairs', (req, res) => {
  res.json({ pairs: PAIRS });
});

app.post('/analyze', async (req, res) => {
  const { pair } = req.body;
  try {
    const results = {};
    for (const tf of TIMEFRAMES) {
      const url = `${BASE_URL}?symbol=${pair.replace('/', '')}&interval=${tf}&apikey=${API_KEY}&outputsize=100`;
      const { data } = await axios.get(url);
      if (!data.values) throw new Error('No data');
      const candles = data.values.map(v => ({
        open: +v.open, high: +v.high, low: +v.low, close: +v.close, time: v.datetime
      })).reverse();
      results[tf] = {
        keltner: keltner(candles),
        donchian: donchian(candles),
        tsi: tsi(candles),
        cmo: cmo(candles),
      };
    }
    // Trend/bias logic and signal generation would go here
    res.json({ timeframes: results });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(3001, () => console.log('Backend running on port 3001'));
