export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const debugToken = process.env.OPENAI_MODELS_DEBUG_TOKEN;

  if (!debugToken || req.headers.authorization !== `Bearer ${debugToken}`) {
    return res.status(404).json({ error: 'Not found' });
  }

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing OPENAI_API_KEY environment variable' });
  }

  let baseUrl: string;
  try {
    const url = new URL(process.env.OPENAI_BASE_URL?.trim() || 'https://api.openai.com/v1');
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('OPENAI_BASE_URL must use http or https');
    }
    baseUrl = url.toString().replace(/\/$/, '');
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Invalid OPENAI_BASE_URL'
    });
  }

  const openAIRes = await fetch(`${baseUrl}/models`, {
    headers: { Authorization: `Bearer ${apiKey}` }
  });
  const text = await openAIRes.text();

  let body: unknown = text;
  try {
    body = JSON.parse(text);
  } catch {
    // Keep raw text for non-JSON responses.
  }

  return res.status(openAIRes.status).json(body);
}
