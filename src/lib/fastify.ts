import { FastifyReply, FastifyRequest, FastifyServerOptions } from 'fastify';
import z, { ZodError } from 'zod';

import { app } from 'app';
import { env } from 'env';
import { CustomError } from 'use-cases/errors/custom-error';
import { rateLimitOptions } from './rate-limit';

export function getServerOptions() {
  let serverOptions: FastifyServerOptions = {};

  if (process.stdout.isTTY) {
    serverOptions = {
      logger: {
        enabled: env.NODE_ENV === 'development',
        transport: {
          target: 'pino-pretty',
          options: {
            translateTime: 'dd-mm-yyyy HH:MM:ss',
            colorize: true,
            ignore: 'pid,hostname',
          },
        },
      },
    };
  } else {
    serverOptions = {
      logger: { level: env.LOG_LEVEL ?? 'silent' },
    };
  }

  return serverOptions;
}

export async function customErrorHandler() {
  app.setErrorHandler((error, request, reply) => {
    if (error.statusCode === 429) {
      error.message =
        'You have sent too many requests in a short period, please try again later.';

      return reply.code(429).send(error);
    }

    if (error instanceof ZodError) {
      return reply.code(400).send({
        code: 'ValidationError',
        issues: z.treeifyError(error),
      });
    }

    if (error instanceof CustomError) {
      const { httpCode, code, message } = error.getResponse();

      return reply.code(httpCode).send({ code, message });
    }

    if (env.NODE_ENV !== 'production') {
      app.log.error(
        {
          error,
          request: {
            method: request.method,
            url: request.url,
            query: request.query,
            params: request.params,
          },
        },
        'Unhandled error occurred',
      );
    } else {
      // send error to external tool DataDog/New Relic/Sentry
    }

    return reply.code(500).send({
      code: 'ServerError',
      message: 'Internal server error.',
      error: error,
    });
  });

  // An attacker could search for valid URLs if the 404 error handling is not rate limited.
  app.setNotFoundHandler(
    { preHandler: app.rateLimit(rateLimitOptions) },
    (request: FastifyRequest, reply: FastifyReply) => {
      request.log.warn(
        {
          request: {
            method: request.method,
            url: request.url,
            query: request.query,
            params: request.params,
          },
        },
        'Resource not found',
      );

      return reply.code(404).send({ message: 'Not Found' });
    },
  );
}
