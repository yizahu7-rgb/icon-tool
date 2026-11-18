export const config = {
  maxDuration: 60
};

type RequestBody = {
  concept?: string;
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
    finish_reason?: string | null;
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

type IconfontSearchIcon = {
  id?: number;
  name?: string;
  show_svg?: string;
};

type IconfontSearchResponse = {
  code?: number;
  data?: {
    icons?: IconfontSearchIcon[];
  };
};

type IconfontReference = {
  provider: 'Iconfont';
  id: number;
  name: string;
  query: string;
  sort: 'collections';
  match: 'exact-name' | 'fuzzy-first';
  structuralSvg: string;
};

const DEFAULT_MODELS = ['gpt-6.1-sol', 'gpt-6-luna'];
const MODEL_TIME_BUDGET_MS = 50000;
const SVG_GENERATION_TOKEN_BUDGET = 8192;
const ICONFONT_SEARCH_URL = 'https://www.iconfont.cn/api/icon/search.json';
const ICONFONT_TIMEOUT_MS = 5000;
const ICONFONT_CACHE_TTL_MS = 30 * 60 * 1000;
const iconfontReferenceCache = new Map<string, { expiresAt: number; value: IconfontReference | null }>();

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

const getReasoningEffort = (model: string) => {
  if (/^gpt-6-luna(?:$|[-.:/])/i.test(model)) return 'none';
  if (/^gpt-6(?:\.1)?-sol(?:$|[-.:/])/i.test(model)) return 'low';
  return null;
};

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

const sanitizePlainText = (value: string, maxLength: number) => value
  .replace(/[\u0000-\u001f\u007f<>]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
  .slice(0, maxLength);

const normalizeIconfontName = (value: string) => sanitizePlainText(value, 80)
  .toLowerCase()
  .replace(/[\s\p{P}\p{S}]+/gu, '');

const extractSvgAttribute = (tag: string, name: string) => {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])([\\s\\S]*?)\\1`, 'i'));
  return match?.[2]?.trim() || '';
};

const getStructuralSvg = (raw: string) => {
  const svgTag = raw.match(/<svg\b[^>]*>/i)?.[0] || '';
  const rawViewBox = extractSvgAttribute(svgTag, 'viewBox');
  const viewBoxValues = rawViewBox.split(/[\s,]+/).map(Number);
  const viewBox = viewBoxValues.length === 4 && viewBoxValues.every(Number.isFinite)
    ? viewBoxValues.join(' ')
    : '0 0 1024 1024';

  let totalLength = 0;
  const paths = (raw.match(/<path\b[^>]*>/gi) || []).flatMap((tag) => {
    if (totalLength >= 12000) return [];
    const pathData = extractSvgAttribute(tag, 'd');
    if (!pathData || !/^[MmLlHhVvCcSsQqTtAaZz0-9eE+.,\s-]+$/.test(pathData)) return [];
    const remaining = 12000 - totalLength;
    if (pathData.length > remaining) return [];
    totalLength += pathData.length;
    return [`<path d="${pathData.replace(/"/g, '&quot;')}"/>`];
  }).slice(0, 12);

  return paths.length
    ? `<svg viewBox="${viewBox}">${paths.join('')}</svg>`
    : null;
};

const getIconfontReference = async (concept: string): Promise<IconfontReference | null> => {
  const query = sanitizePlainText(concept, 80);
  if (!query || query === '参考图中的主体') return null;

  const cacheKey = query.toLowerCase();
  const cached = iconfontReferenceCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ICONFONT_TIMEOUT_MS);
  let reference: IconfontReference | null = null;

  try {
    const form = new URLSearchParams({
      q: query,
      sortType: 'collections',
      page: '1',
      pageSize: '20',
      sType: '',
      fromCollection: '-1',
      fills: '',
      ctoken: 'null'
    });
    const response = await fetch(ICONFONT_SEARCH_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Content-Type': 'application/x-www-form-urlencoded',
        Origin: 'https://www.iconfont.cn',
        Referer: 'https://www.iconfont.cn/',
        'User-Agent': 'Mozilla/5.0 (compatible; TDesignV2IconReference/1.0)'
      },
      body: form.toString(),
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`Iconfont search returned ${response.status}`);
    const payload = await response.json() as IconfontSearchResponse;
    const icons = payload.code === 200 ? payload.data?.icons || [] : [];
    const normalizedQuery = normalizeIconfontName(query);
    const exactIcon = icons.find((candidate) => (
      typeof candidate.name === 'string'
      && normalizeIconfontName(candidate.name) === normalizedQuery
    ));
    const icon = exactIcon || icons[0];
    const structuralSvg = typeof icon?.show_svg === 'string' ? getStructuralSvg(icon.show_svg) : null;
    if (typeof icon?.id === 'number' && structuralSvg) {
      reference = {
        provider: 'Iconfont',
        id: icon.id,
        name: sanitizePlainText(icon.name || query, 80) || query,
        query,
        sort: 'collections',
        match: exactIcon ? 'exact-name' : 'fuzzy-first',
        structuralSvg
      };
    }
  } catch (error) {
    console.warn('Iconfont reference lookup failed; using local references instead.', error);
  } finally {
    clearTimeout(timeout);
  }

  if (iconfontReferenceCache.size >= 100) {
    const oldestKey = iconfontReferenceCache.keys().next().value;
    if (typeof oldestKey === 'string') iconfontReferenceCache.delete(oldestKey);
  }
  iconfontReferenceCache.set(cacheKey, {
    expiresAt: Date.now() + ICONFONT_CACHE_TTL_MS,
    value: reference
  });
  return reference;
};

const formatIconfontReference = (reference: IconfontReference) => `

ICONFONT COLLECTION-PRIORITY REFERENCE — primary semantic reference
- Provider: Iconfont (iconfont.cn)
- Search query: ${reference.query}
- Result rule: ${reference.match === 'exact-name'
    ? 'highest-ranked exact-name result within sortType=collections results'
    : 'no exact-name result found; first fuzzy result returned by sortType=collections'}
- Icon: ${reference.name}
- Icon ID: ${reference.id}
- Structural SVG (topology reference only):
${reference.structuralSvg}

Use this reference before project-library references to choose the recognizable object metaphor and object relationships. Never copy its source coordinates, path density, fill style, or visual defects. Redraw it on the 32×32 TDesign v2 master. A locked family master, TDesign v2 keyline, stroke-layer separation, centering, spacing, and validation rules remain mandatory.`;

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
  const iconfontReference = body.image?.data
    ? null
    : await getIconfontReference(body.concept?.trim() || '');
  if (iconfontReference) {
    console.info(
      `[Iconfont reference] query="${iconfontReference.query}" result="${iconfontReference.name}" id=${iconfontReference.id} match=${iconfontReference.match} structuralSvgLength=${iconfontReference.structuralSvg.length}`
    );
  } else if (!body.image?.data) {
    console.info(`[Iconfont reference] no usable result for query="${body.concept?.trim() || ''}"`);
  }
  const referencedPrompt = iconfontReference
    ? `${prompt}${formatIconfontReference(iconfontReference)}`
    : prompt;
  const responsesContent: Array<Record<string, unknown>> = [{ type: 'input_text', text: referencedPrompt }];
  const chatContent: Array<Record<string, unknown>> = [{ type: 'text', text: referencedPrompt }];

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
      const reasoningEffort = getReasoningEffort(model);
      const requestBody = apiMode === 'chat_completions'
        ? {
            model,
            messages: [{ role: 'user', content: chatContent }],
            max_completion_tokens: SVG_GENERATION_TOKEN_BUDGET,
            ...(reasoningEffort ? { reasoning_effort: reasoningEffort } : {})
          }
        : {
            model,
            input: [{ role: 'user', content: responsesContent }],
            max_output_tokens: SVG_GENERATION_TOKEN_BUDGET,
            ...(reasoningEffort ? { reasoning: { effort: reasoningEffort } } : {}),
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
      console.warn('[OpenAI empty SVG response]', JSON.stringify({
        model: data.model || model,
        mode: apiMode,
        choices: data.choices?.map((choice) => ({
          finishReason: choice.finish_reason,
          messageKeys: choice.message ? Object.keys(choice.message) : [],
          contentType: Array.isArray(choice.message?.content) ? 'array' : typeof choice.message?.content,
          contentLength: typeof choice.message?.content === 'string' ? choice.message.content.length : undefined
        }))
      }));
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
      attemptedModels,
      reference: iconfontReference
        ? {
            provider: iconfontReference.provider,
            id: iconfontReference.id,
            name: iconfontReference.name,
            query: iconfontReference.query,
            sort: iconfontReference.sort,
            match: iconfontReference.match
          }
        : null
    });
  }

  const status = lastError?.status || 502;

  return res.status(status).json({
    error: `OpenAI API error ${status}`,
    detail: lastError?.detail || 'OpenAI request failed',
    model: lastError?.model,
    attemptedModels,
    reference: iconfontReference
      ? {
          provider: iconfontReference.provider,
          id: iconfontReference.id,
          name: iconfontReference.name,
          query: iconfontReference.query,
          sort: iconfontReference.sort,
          match: iconfontReference.match
        }
      : null
  });
}
