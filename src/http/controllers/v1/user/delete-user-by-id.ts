import { FastifyReply, FastifyRequest } from 'fastify';

import { app } from 'app';
import { getOrDeleteUserByIdParamsSchema } from 'http/validations/user';
import { makeDeleteUserByIdUseCase } from 'use-cases/factories/make-delete-user-use-case';

export async function deleteUserById(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { userId } = getOrDeleteUserByIdParamsSchema.parse(request.params);

  try {
    const deleteUserByIdUseCase = makeDeleteUserByIdUseCase();

    await deleteUserByIdUseCase.execute({ userId });

    reply.code(204);
  } catch (error) {
    app.log.error(error, 'Error while deleting the user.');
    throw error;
  }
}
