import { app } from 'app';
import { FastifyReply, FastifyRequest } from 'fastify';
import { getAllUsersQuerySchema } from 'http/validations/user';
import { makeGetAllUsersUseCase } from 'use-cases/factories/make-get-all-users-use-case';

export async function getAllUsers(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { limit, offset } = getAllUsersQuerySchema.parse(request.query);

  try {
    const getAllUsersUseCase = makeGetAllUsersUseCase();

    const { usersCount: total, users } = await getAllUsersUseCase.execute({
      limit,
      offset,
    });

    return reply.code(200).send({
      limit,
      offset,
      total,
      users,
    });
  } catch (error) {
    app.log.error(error, 'Error while getting all users.');
    throw error;
  }
}
