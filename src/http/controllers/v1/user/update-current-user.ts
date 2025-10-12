import { FastifyReply, FastifyRequest } from 'fastify';

import { app } from 'app';
import { updateCurrentUserBodySchema } from 'http/validations/user';
import { makeUpdateCurrentUserUseCase } from 'use-cases/factories/make-update-current-user-use-case';

export async function updateCurrentUser(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const userId = request.user.sub;
  const userData = updateCurrentUserBodySchema.parse(request.body);

  try {
    const updateCurrentUserUseCase = makeUpdateCurrentUserUseCase();

    const { user } = await updateCurrentUserUseCase.execute({
      userId,
      userData,
    });

    app.log.info(user, 'User updated successfully.');

    return reply.code(200).send({ user, password: undefined });
  } catch (error) {
    app.log.error(error, 'Error while updating the current user.');
    throw error;
  }
}
