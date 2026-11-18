import type { IncomingMessage, ServerResponse } from 'node:http';
import { defineConfig, loadEnv, type Plugin, type ViteDevServer } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const API_BODY_LIMIT = 12 * 1024 * 1024;
const SERVER_ENV_KEYS = [
  'OPENAI_API_KEY',
  'OPENAI_BASE_URL',
  'OPENAI_API_MODE',
  'OPENAI_MODEL',
  'OPENAI_MODELS'
] as const;

type LocalApiResponse = ServerResponse & {
  status: (statusCode: number) => LocalApiResponse;
  json: (payload: unknown) => LocalApiResponse;
};

const readJsonBody = (request: IncomingMessage) => new Promise<unknown>((resolve, reject) => {
  const chunks: Buffer[] = [];
  let totalLength = 0;
  request.on('data', (chunk: Buffer) => {
    totalLength += chunk.length;
    if (totalLength > API_BODY_LIMIT) {
      reject(new Error('Request body is too large'));
      request.destroy();
      return;
    }
    chunks.push(chunk);
  });
  request.on('end', () => {
    try {
      const body = Buffer.concat(chunks).toString('utf8');
      resolve(body ? JSON.parse(body) : {});
    } catch {
      reject(new Error('Request body must be valid JSON'));
    }
  });
  request.on('error', reject);
});

const attachResponseHelpers = (response: ServerResponse): LocalApiResponse => {
  const localResponse = response as LocalApiResponse;
  localResponse.status = (statusCode) => {
    localResponse.statusCode = statusCode;
    return localResponse;
  };
  localResponse.json = (payload) => {
    if (!localResponse.headersSent) {
      localResponse.setHeader('Content-Type', 'application/json; charset=utf-8');
    }
    localResponse.end(JSON.stringify(payload));
    return localResponse;
  };
  return localResponse;
};

const localGenerateIconApi = (): Plugin => ({
  name: 'local-generate-icon-api',
  configureServer(server: ViteDevServer) {
    server.middlewares.use('/api/generate-icon', async (request, response, next) => {
      if (!request.method) return next();
      try {
        (request as IncomingMessage & { body?: unknown }).body = await readJsonBody(request);
        const module = await server.ssrLoadModule('/api/generate-icon.ts');
        const handler = module.default as (req: IncomingMessage & { body?: unknown }, res: LocalApiResponse) => Promise<unknown>;
        await handler(request as IncomingMessage & { body?: unknown }, attachResponseHelpers(response));
      } catch (error) {
        if (response.writableEnded) return;
        const message = error instanceof Error ? error.message : 'Local API failed';
        const statusCode = /body/i.test(message) ? 400 : 500;
        attachResponseHelpers(response).status(statusCode).json({ error: message });
      }
    });
  }
});

export default defineConfig(({ mode }) => {
  const serverEnv = loadEnv(mode, process.cwd(), '');
  SERVER_ENV_KEYS.forEach((key) => {
    if (serverEnv[key]) process.env[key] = serverEnv[key];
  });

  return {
    plugins: [localGenerateIconApi(), react(), tailwindcss()],
    server: {
      proxy: {
        '/local-model': {
          target: 'http://127.0.0.1:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/local-model/, '')
        }
      }
    },
    preview: {
      proxy: {
        '/local-model': {
          target: 'http://127.0.0.1:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/local-model/, '')
        }
      }
    }
  };
});
