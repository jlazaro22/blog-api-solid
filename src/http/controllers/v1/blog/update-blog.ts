import { app } from 'app';
import { FastifyReply, FastifyRequest } from 'fastify';

import {
  updateBlogBodySchema,
  updateDeleteBlogParamsSchema,
} from 'http/validations/blog';
import { parseMultipart } from 'lib/multipart';
import { makeUpdateBlogUseCase } from 'use-cases/factories/make-update-blog-use-case';

export async function updateBlog(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const userId = request.user.sub;
  const { blogId } = updateDeleteBlogParamsSchema.parse(request.params);
  const fieldParts = request.parts();

  try {
    const { fields, fileBuffer } = await parseMultipart('put', fieldParts);
    const { title, content, status } = updateBlogBodySchema.parse(fields);
    const updateBlogUseCase = makeUpdateBlogUseCase();

    const blog = await updateBlogUseCase.execute({
      userId,
      blogId,
      fileBuffer,
      title,
      content,
      status,
    });

    return reply.code(201).send(blog);
  } catch (error) {
    app.log.error(error, 'Error while updating blog.');
    throw error;
  }
}
