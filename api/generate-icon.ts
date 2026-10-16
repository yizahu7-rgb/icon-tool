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

type OpenAIError = {
  status: number;
  detail: string;
  model: string;
};

type OpenAIOutputPart = {
  type?: string;
  text?: string;
};

type OpenAIOutputItem = {
  type?: string;
  content?: OpenAIOutputPart[];
};

type OpenAIResponse = {
  model?: string;
  output?: OpenAIOutputItem[];
  choices?: Array<{
    message?: {
      content?: string | Array<{
        type?: string;
        text?: string;
      }> | null;
    };
  }>;
  error?: {
    message?: string;
  };
};

type OpenAIApiMode = 'responses' | 'chat_completions';

const DEFAULT_MODELS = ['gpt-6.1-sol', 'gpt-6-luna'];
const MODEL_TIME_BUDGET_MS = 50000;

const getModels = () => {
  const singleModel = process.env.OPENAI_MODEL?.trim();
  if (singleModel && /^[a-z0-9._:/-]+$/i.test(singleModel)) {
    return [singleModel];
  }

  const configuredModels = (process.env.OPENAI_MODELS || '')
    .split(',')
    .map((model) => model.trim())
    .filter((model) => /^[a-z0-9.-]+$/i.test(model));

  return configuredModels.length > 0 ? configuredModels : DEFAULT_MODELS;
};

const getApiMode = (): OpenAIApiMode => (
  process.env.OPENAI_API_MODE?.trim().toLowerCase() === 'chat_completions'
    ? 'chat_completions'
    : 'responses'
);

const getBaseUrl = () => {
  const configuredBaseUrl = process.env.OPENAI_BASE_URL?.trim() || 'https://api.openai.com/v1';
  const url = new URL(configuredBaseUrl);

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('OPENAI_BASE_URL must use http or https');
  }

  return url.toString().replace(/\/$/, '');
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

const parseOpenAIResponse = async (response: Response): Promise<OpenAIResponse> => {
  const detail = await response.text();
  try {
    return JSON.parse(detail) as OpenAIResponse;
  } catch {
    return { error: { message: detail } };
  }
};

const getOutputText = (data: OpenAIResponse) => (data.output || [])
  .filter((item) => item.type === 'message')
  .flatMap((item) => item.content || [])
  .filter((part) => part.type === 'output_text' && typeof part.text === 'string')
  .map((part) => part.text?.trim() || '')
  .filter(Boolean)
  .join('\n')
  .trim();

const getChatCompletionText = (data: OpenAIResponse) => {
  const content = data.choices?.[0]?.message?.content;
  if (typeof content === 'string') return content.trim();

  return (content || [])
    .filter((part) => part.type === 'text' && typeof part.text === 'string')
    .map((part) => part.text?.trim() || '')
    .filter(Boolean)
    .join('\n')
    .trim();
};

const shouldTryFallback = (error: OpenAIError) => {
  return (
    [404, 408, 409, 429, 500, 502, 503, 504].includes(error.status) ||
    /quota|rate|exceeded|overloaded|unavailable|timed out|timeout|model.*not found/i.test(error.detail)
  );
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing OPENAI_API_KEY environment variable' });
  }

  const body = parseBody(req.body);
  const prompt = body.prompt?.trim();

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  let baseUrl: string;
  try {
    baseUrl = getBaseUrl();
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Invalid OPENAI_BASE_URL'
    });
  }

  const apiMode = getApiMode();
  const responsesContent: Array<Record<string, unknown>> = [{ type: 'input_text', text: prompt }];
  const chatContent: Array<Record<string, unknown>> = [{ type: 'text', text: prompt }];

  if (body.image?.data && body.image?.mimeType) {
    const imageUrl = `data:${body.image.mimeType};base64,${body.image.data}`;
    responsesContent.push({
      type: 'input_image',
      image_url: imageUrl,
      detail: 'high'
    });
    chatContent.push({
      type: 'image_url',
      image_url: {
        url: imageUrl,
        detail: 'high'
      }
    });
  }

  const models = getModels();
  const modelTimeoutMs = Math.floor(MODEL_TIME_BUDGET_MS / models.length);
  const attemptedModels: string[] = [];
  let lastError: OpenAIError | null = null;

  for (const model of models) {
    attemptedModels.push(model);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), modelTimeoutMs);
    let openAIRes: Response;

    try {
      const endpoint = apiMode === 'chat_completions'
        ? `${baseUrl}/chat/completions`
        : `${baseUrl}/responses`;
      const requestBody = apiMode === 'chat_completions'
        ? {
            model,
            messages: [{ role: 'user', content: chatContent }],
            max_completion_tokens: 4096
          }
        : {
            model,
            input: [{ role: 'user', content: responsesContent }],
            max_output_tokens: 4096,
            store: false
          };

      openAIRes = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal,
        body: JSON.stringify(requestBody)
      });
    } catch (error) {
      lastError = {
        status: 504,
        detail: error instanceof Error && error.name === 'AbortError'
          ? `OpenAI model timed out after ${modelTimeoutMs / 1000} seconds`
          : error instanceof Error ? error.message : 'OpenAI request failed',
        model
      };
      continue;
    } finally {
      clearTimeout(timeout);
    }

    const data = await parseOpenAIResponse(openAIRes);

    if (!openAIRes.ok) {
      lastError = {
        status: openAIRes.status,
        detail: data.error?.message || 'OpenAI request failed',
        model
      };

      if (shouldTryFallback(lastError)) {
        continue;
      }
      break;
    }

    const text = apiMode === 'chat_completions'
      ? getChatCompletionText(data)
      : getOutputText(data);

    if (!text) {
      lastError = {
        status: 502,
        detail: 'OpenAI returned no SVG text',
        model
      };
      continue;
    }

    return res.status(200).json({
      text,
      model: data.model || model,
      attemptedModels
    });
  }

  const status = lastError?.status || 502;

  return res.status(status).json({
    error: `OpenAI API error ${status}`,
    detail: lastError?.detail || 'OpenAI request failed',
    model: lastError?.model,
    attemptedModels
  });
}
