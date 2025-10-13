import { app } from 'app';
import { FastifyReply, FastifyRequest } from 'fastify';
import { makeGetUserByIdUseCase } from 'use-cases/factories/make-get-user-by-id';

export async function getCurrentUser(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const userId = request.user.sub;

  try {
    const getUserByIdUseCase = makeGetUserByIdUseCase();

    const { user } = await getUserByIdUseCase.execute({ userId });

    return reply.status(200).send({ user });
  } catch (error) {
    app.log.error(error, 'Error while getting the current user.');
    throw error;
  }
}
