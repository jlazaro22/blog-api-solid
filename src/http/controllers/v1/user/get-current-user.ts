import { app } from 'app';
import { FastifyReply, FastifyRequest } from 'fastify';
import { makeGetCurrentUserUseCase } from 'use-cases/factories/make-get-current-user-use-case';

export async function getCurrentUser(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const userId = request.user.sub;

  try {
    const getCurrentUserUseCase = makeGetCurrentUserUseCase();

    const { user } = await getCurrentUserUseCase.execute({ userId });

    return reply.status(200).send({ user });
  } catch (error) {
    app.log.error(error, 'Error while getting the current user.');
    throw error;
  }
}
