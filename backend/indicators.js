// Advanced indicator implementations for scalping
const { KeltnerChannels, DonchianChannels, TSI, CMO } = require('technicalindicators');

function keltner(candles) {
  const closes = candles.map(c => c.close);
  const highs = candles.map(c => c.high);
  const lows = candles.map(c => c.low);
  return KeltnerChannels.calculate({
    close: closes,
    high: highs,
    low: lows,
    period: 20,
    multiplier: 2,
  }).slice(-1)[0];
}

function donchian(candles) {
  const highs = candles.map(c => c.high);
  const lows = candles.map(c => c.low);
  return DonchianChannels.calculate({
    high: highs,
    low: lows,
    period: 20,
  }).slice(-1)[0];
}

function tsi(candles) {
  const closes = candles.map(c => c.close);
  return TSI.calculate({
    values: closes,
    long: 25,
    short: 13,
  }).slice(-1)[0];
}

function cmo(candles) {
  const closes = candles.map(c => c.close);
  return CMO.calculate({
    period: 14,
    values: closes,
  }).slice(-1)[0];
}

module.exports = { keltner, donchian, tsi, cmo };
