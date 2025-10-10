import { FastifyCompressOptions } from '@fastify/compress';

export const compressOptions: FastifyCompressOptions = {
  global: true,
  threshold: 1024, // Only compress responses larger than 1kb
};
