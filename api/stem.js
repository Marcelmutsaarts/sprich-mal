// De stem van de verkoper: tekst naar spraak via OpenRouter (Duitse stemmen van Microsoft MAI-Voice).

const URL = 'https://openrouter.ai/api/v1/audio/speech';
const MODEL = process.env.STEM_MODEL || 'microsoft/mai-voice-2.1-flash';
const SUFFIX = MODEL.includes('2.1-flash') ? 'MAI-Voice-2.1-Flash' : 'MAI-Voice-2.1';
const STEMMEN = {
  becker: process.env.STEM_BECKER || `de-DE-Mia:${SUFFIX}`,
  jonas: process.env.STEM_JONAS || `de-DE-Grant:${SUFFIX}`,
  lena: process.env.STEM_LENA || `de-DE-Harper:${SUFFIX}`,
  schmidt: process.env.STEM_SCHMIDT || `de-DE-Klaus:${SUFFIX}`,
};
const BASIS = 'Speak clear standard German with careful articulation, like a shop assistant talking to a young foreign customer who is still learning German.';
const TOON = {
  neutraal: 'Calm and polite.',
  vriendelijk: 'Warm and friendly.',
  blij: 'Cheerful and enthusiastic.',
  nadenkend: 'Thoughtful, with a short pause.',
  verbaasd: 'Slightly surprised, with a rising question intonation.',
  spijt: 'Apologetic and sympathetic.',
};

async function tts(key, payload) {
  return fetch(URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://sprich-mal.vercel.app',
      'X-Title': 'Sprich mal!',
    },
    body: JSON.stringify(payload),
  });
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ fout: 'Alleen POST' });
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return res.status(503).json({ fout: 'geen-sleutel' });

  let body = req.body || {};
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  const tekst = String(body.tekst || '').trim().slice(0, 400);
  const stem = STEMMEN[body.wie] || STEMMEN.becker;
  if (!tekst) return res.status(400).json({ fout: 'Geen tekst' });
  const langzaam = Boolean(body.langzaam);

  const payload = {
    model: MODEL,
    input: tekst,
    voice: stem,
    response_format: 'mp3',
    instructions: `${BASIS} ${TOON[body.emotie] || TOON.vriendelijk}${langzaam ? ' Speak slowly, with short pauses between phrases.' : ''}`,
    speed: langzaam ? 0.75 : 0.95,
  };

  try {
    let r = await tts(key, payload);
    if (!r.ok && r.status === 400) { delete payload.speed; r = await tts(key, payload); }
    if (!r.ok) {
      const fout = await r.text().catch(() => '');
      return res.status(502).json({ fout: `Stem gaf status ${r.status}`, details: fout.slice(0, 300) });
    }
    const buf = Buffer.from(await r.arrayBuffer());
    res.setHeader('Content-Type', 'audio/mpeg');
    return res.status(200).send(buf);
  } catch (e) {
    return res.status(502).json({ fout: e.message || 'Stem lukt niet' });
  }
}
