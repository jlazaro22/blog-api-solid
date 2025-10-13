import { FastifyMultipartOptions, Multipart } from '@fastify/multipart';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

import { app } from 'app';
import { CustomError } from 'use-cases/errors/custom-error';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

export const multipartOptions: FastifyMultipartOptions = {
  limits: {
    files: 1, // Max number of file fields
    fileSize: 2 * 1024 * 1024, // 2 MB // For multipart forms, the max file size in bytes
  },
};

export async function parseMultipart(
  method: 'post' | 'put',
  parts: AsyncIterableIterator<Multipart>,
) {
  const fields: { [key: string]: any } = {};
  let fileBuffer: Buffer<ArrayBufferLike> | undefined;

  try {
    for await (const part of parts) {
      if (part.type === 'file') {
        fileBuffer = await part.toBuffer();
      } else {
        fields[part.fieldname] = purify.sanitize(part.value as string);
      }
    }

    if (method === 'put' && !fileBuffer) {
      return { fields };
    }

    return { fields, fileBuffer };
  } catch (error) {
    app.log.error(error, 'Error parsing the multipart request.');

    if (error instanceof app.multipartErrors.RequestFileTooLargeError) {
      throw new CustomError({
        httpCode: 413,
        code: 'ValidationError',
        message: 'Blog banner image size must be less than 2MB.',
      });
    }

    if (error instanceof app.multipartErrors.FilesLimitError) {
      throw new CustomError({
        httpCode: 400,
        code: 'ValidationError',
        message: 'A single file is accepted for the blog banner image.',
      });
    }

    throw error;
  }
}
