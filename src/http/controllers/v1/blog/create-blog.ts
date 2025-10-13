import { FastifyReply, FastifyRequest } from 'fastify';

import { app } from 'app';
import { createBlogBodySchema } from 'http/validations/blog';
import { parseMultipart } from 'lib/multipart';
import { makeCreateBlogUseCase } from 'use-cases/factories/make-create-blog-use-case';

export async function createBlog(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub;
  const fieldParts = request.parts();

  try {
    const { fields, fileBuffer } = await parseMultipart('post', fieldParts);

    if (!fileBuffer) {
      return reply.code(400).send({
        code: 'ValidationError',
        message: 'Blog banner image is required.',
      });
    }

    const { title, content, status } = createBlogBodySchema.parse(fields);
    const createBlogUseCase = makeCreateBlogUseCase();
    const blog = await createBlogUseCase.execute({
      userId,
      fileBuffer,
      title,
      content,
      status,
    });

    app.log.info({ blog }, 'Blog created successfully.');

    return reply.code(201).send(blog);
  } catch (error) {
    app.log.error(error, 'Error while creating the blog.');
    throw error;
  }
}
