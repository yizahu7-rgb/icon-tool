export const config = {
  maxDuration: 60
};

type RequestBody = {
  prompt?: string;
  image?: {
    mimeType?: string | null;
    data?: string | null;
  } | null;
};

const parseBody = (body: unknown): RequestBody => {
  if (!body) return {};
  if (typeof body === 'string') {
    try {
      return JSON.parse(body) as RequestBody;
    } catch {
      return {};
    }
  }
  return body as RequestBody;
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing GEMINI_API_KEY environment variable' });
  }

  const body = parseBody(req.body);
  const prompt = body.prompt?.trim();

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  const parts: Array<Record<string, unknown>> = [{ text: prompt }];

  if (body.image?.data && body.image?.mimeType) {
    parts.push({
      inlineData: {
        mimeType: body.image.mimeType,
        data: body.image.data
      }
    });
  }

  const geminiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts }],
        generationConfig: { temperature: 0.1 }
      })
    }
  );

  if (!geminiRes.ok) {
    const detail = await geminiRes.text();
    return res.status(geminiRes.status).json({
      error: `Gemini API error ${geminiRes.status}`,
      detail
    });
  }

  const data = await geminiRes.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    return res.status(502).json({ error: 'Gemini returned no SVG text' });
  }

  return res.status(200).json({ text });
}
