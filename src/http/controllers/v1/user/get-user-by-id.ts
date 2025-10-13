import { app } from 'app';
import { FastifyReply, FastifyRequest } from 'fastify';
import { getOrDeleteUserByIdParamsSchema } from 'http/validations/user';
import { makeGetUserByIdUseCase } from 'use-cases/factories/make-get-user-by-id';

export async function getUserById(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { userId } = getOrDeleteUserByIdParamsSchema.parse(request.params);

  try {
    const getUserByIdUseCase = makeGetUserByIdUseCase();

    const user = await getUserByIdUseCase.execute({ userId });

    return reply.status(200).send({ user });
  } catch (error) {
    app.log.error(error, 'Error while getting the user.');
    throw error;
  }
}
