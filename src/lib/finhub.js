const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

export async function ipoCalendar(from, to) {
  const { FINNHUB_API_KEY } = process.env;
  if (!FINNHUB_API_KEY) {
    throw new Error('FINNHUB_API_KEY not set in .env');
  }

  const url = `${FINNHUB_BASE_URL}/calendar/ipo?from=${from}&to=${to}&token=${FINNHUB_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Finnhub IPO fetch failed: ${res.status}`);
  }
  const data = await res.json();
  return data.ipoCalendar || [];
}