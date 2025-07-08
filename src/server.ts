import 'dotenv/config'
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import {
  fastifyTRPCPlugin,
  FastifyTRPCPluginOptions,
} from '@trpc/server/adapters/fastify';

import { authCallback } from './server/services/user/auth-callback';
import { appRouter } from './server/api/api.routes';
import { createContext } from './server/api/trpc';
import { heartbeat } from './server/system/heartbeat';
import { readyCheck } from './server/system/ready';
import { dummyPluginFactory } from '@fhss-web-team/backend-utils';
import { dummyFunctions } from './server/dummy/dummy.functions';

const port = parseInt(process.env['PORT'] ?? '') || 4000;
const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const angularApp = new AngularNodeAppEngine();
const app = Fastify({ logger: true });

export type AppRouter = typeof appRouter;

/**
 * Serve static files from /browser
 */
app.register(fastifyStatic, {
  root: browserDistFolder,
  prefix: '/',
  wildcard: false,
  index: false,
  maxAge: '1y',
});

/**
 * tRPC Adapter
 */
app.register(fastifyTRPCPlugin, {
  prefix: '/api',
  trpcOptions: {
    router: appRouter,
    createContext,
    onError({ path, error }) {
      // report to error monitoring
      console.error(`Error in tRPC handler on path '${path}':`, error);
    },
  } satisfies FastifyTRPCPluginOptions<AppRouter>['trpcOptions'],
});

/**
 * HTTP endpoints
 */
app.get('/api/auth/callback', authCallback);
app.get('/sys/heartbeat', heartbeat);
app.get('/sys/ready', readyCheck);

/**
 * Dummy endpoints
 */
if (['dev', 'staging'].includes(process.env['ENVIRONMENT'] ?? 'no')) {
  app.register(dummyPluginFactory(dummyFunctions));
}

/**
 * Handle all other requests by rendering the Angular application.
 */
app.get('/*', async (request, reply) => {
  try {
    const ssrResponse = await angularApp.handle(request.raw);
    if (ssrResponse) {
      await writeResponseToNodeResponse(ssrResponse, reply.raw);
    } else {
      return reply.callNotFound();
    }
  } catch (err) {
    reply.send(err);
  }
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  app.listen({ port }, (err, address) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(async (req, res) => {
  await app.ready();
  app.server.emit('request', req, res);
});
