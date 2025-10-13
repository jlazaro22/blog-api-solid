import { app } from 'app';
import { env } from 'env';
import { FastifyReply, FastifyRequest } from 'fastify';
import { makeDeleteCurrentUserUseCase } from 'use-cases/factories/make-delete-current-user-use-case';

export async function deleteCurrentUser(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const userId = request.user.sub;

  try {
    const deleteCurrentUserUseCase = makeDeleteCurrentUserUseCase();

    await deleteCurrentUserUseCase.execute({ userId });

    reply
      .clearCookie('refreshToken', {
        path: '/',
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
      })
      .code(204);
  } catch (error) {
    app.log.error(error, 'Error while deleting the user.');
    throw error;
  }
}
