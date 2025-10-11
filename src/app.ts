import fastifyCompress from '@fastify/compress';
import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import fastifyFormbody from '@fastify/formbody';
import fastifyHelmet from '@fastify/helmet';
import fastifyJwt from '@fastify/jwt';
import fastifyMultipart from '@fastify/multipart';
import fastifyRateLimit from '@fastify/rate-limit';
import fastify from 'fastify';
import { v1Routes } from 'http/routes/v1';
import { compressOptions } from 'lib/compress';

import { corsOptions } from 'lib/cors';
import { customErrorHandler, getServerOptions } from 'lib/fastify';
import { jwtOptions } from 'lib/jwt';
import { multipartOptions } from 'lib/multipart';
import { rateLimitOptions } from 'lib/rate-limit';

export const app = await fastify(getServerOptions());

// *** Plugins ***
await app.register(fastifyCors, corsOptions);
await app.register(fastifyFormbody);
await app.register(fastifyMultipart, multipartOptions);
await app.register(fastifyJwt, jwtOptions);
await app.register(fastifyCookie);
await app.register(fastifyCompress, compressOptions);
await app.register(fastifyHelmet);
await app.register(fastifyRateLimit, rateLimitOptions);

// *** Error handling ***
customErrorHandler();

// *** Routes ***
await app.register(v1Routes, { prefix: '/api/v1' });
