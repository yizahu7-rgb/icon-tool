export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const debugToken = process.env.GEMINI_MODELS_DEBUG_TOKEN;

  if (!debugToken || req.headers.authorization !== `Bearer ${debugToken}`) {
    return res.status(404).json({ error: 'Not found' });
  }

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing GEMINI_API_KEY environment variable' });
  }

  const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
  const text = await geminiRes.text();

  let body: unknown = text;
  try {
    body = JSON.parse(text);
  } catch {
    // Keep raw text for non-JSON responses.
  }

  return res.status(geminiRes.status).json(body);
}
