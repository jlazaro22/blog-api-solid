import { app } from 'app';
import { FastifyReply, FastifyRequest } from 'fastify';

import { getBlogBySlugParamsSchema } from 'http/validations/blog';
import { makeGetBlogBySlugUseCase } from 'use-cases/factories/make-get-blog-by-slug-use-case';

export async function getBlogBySlug(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.user.sub;
  const { slug } = getBlogBySlugParamsSchema.parse(request.params);

  try {
    const getBlogBySlugUseCase = makeGetBlogBySlugUseCase();

    const { blog } = await getBlogBySlugUseCase.execute({
      userId,
      slug,
    });

    return reply.code(200).send(blog);
  } catch (error) {
    app.log.error(error, 'Error while fetching blog by slug.');
    throw error;
  }
}
