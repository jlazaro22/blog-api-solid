import { app } from 'app';
import { FastifyReply, FastifyRequest } from 'fastify';
import { deleteCommentParamsSchema } from 'http/validations/comment';
import { makeDeleteCommentUseCase } from 'use-cases/factories/make-delete-comment-use-case';

export async function deleteComment(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const currentUserId = request.user.sub;
  const { commentId } = deleteCommentParamsSchema.parse(request.params);

  try {
    const deleteCommentUseCase = makeDeleteCommentUseCase();

    await deleteCommentUseCase.execute({
      currentUserId,
      commentId,
    });

    reply.code(204);
  } catch (error) {
    app.log.error(error, 'Error deleting comment.');
    throw error;
  }
}
