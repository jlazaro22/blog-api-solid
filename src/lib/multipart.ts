import { FastifyMultipartOptions } from '@fastify/multipart';

export const multipartOptions: FastifyMultipartOptions = {
  limits: {
    files: 1, // Max number of file fields
    fileSize: 2 * 1024 * 1024, // 2 MB // For multipart forms, the max file size in bytes
  },
};
