import { app } from 'app';
import { FastifyReply, FastifyRequest } from 'fastify';
import { registerBodySchema } from 'http/validations/auth';
import { makeRegisterUseCase } from 'use-cases/factories/make-register-use-case';

export async function register(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { email, password, role } = registerBodySchema.parse(request.body);

  try {
    const registerUseCase = makeRegisterUseCase();

    const { user } = await registerUseCase.execute({ email, password, role });

    app.log.info(
      {
        user: {
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
      'User registered successfully.',
    );

    return reply.code(201).send({
      message: 'User registered successfully.',
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    app.log.error(error, 'Error during user registration.');
    throw error;
  }
}
