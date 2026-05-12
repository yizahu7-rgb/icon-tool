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

type GeminiError = {
  status: number;
  detail: string;
  model: string;
};

const MODELS = ['gemini-3-flash-preview', 'gemini-3.1-flash-lite-preview', 'gemini-3.1-flash-lite'];

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

const parseGeminiError = async (response: Response) => {
  const detail = await response.text();
  try {
    const parsed = JSON.parse(detail);
    return parsed.error?.message || detail;
  } catch {
    return detail;
  }
};

const shouldTryFallback = (error: GeminiError) => {
  return (
    [404, 429, 503].includes(error.status) ||
    /quota|rate|exceeded|resource_exhausted|overloaded|unavailable/i.test(error.detail)
  );
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

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

  const attemptedModels: string[] = [];
  let lastError: GeminiError | null = null;

  for (const model of MODELS) {
    attemptedModels.push(model);
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
      lastError = {
        status: geminiRes.status,
        detail: await parseGeminiError(geminiRes),
        model
      };

      if (shouldTryFallback(lastError)) {
        continue;
      }
      break;
    }

    const data = await geminiRes.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      lastError = {
        status: 502,
        detail: 'Gemini returned no SVG text',
        model
      };
      continue;
    }

    return res.status(200).json({ text, model, attemptedModels });
  }

  const status = lastError?.status || 502;

  return res.status(status).json({
    error: `Gemini API error ${status}`,
    detail: lastError?.detail || 'Gemini request failed',
    model: lastError?.model,
    attemptedModels
  });
}
