import { FastifyReply, FastifyRequest } from 'fastify';

import { app } from 'app';
import { env } from 'env';
import { loginBodySchema } from 'http/validations/auth';
import { makeLoginUseCase } from 'use-cases/factories/make-login-use-case';

export async function login(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { email, password } = loginBodySchema.parse(request.body);

  try {
    const { loginUseCase, tokensRepository } = makeLoginUseCase();

    const { user } = await loginUseCase.execute({ email, password });

    const accessToken = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user._id.toString(),
          expiresIn: env.ACCESS_TOKEN_EXPIRY,
        },
      },
    );

    const refreshToken = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user._id.toString(),
          expiresIn: env.REFRESH_TOKEN_EXPIRY,
        },
      },
    );

    await tokensRepository.deleteAllByUserId(user._id.toString());
    await tokensRepository.create(refreshToken, user._id.toString());

    app.log.info(
      {
        userId: user._id,
        token: refreshToken,
      },
      'Refresh token created.',
    );

    app.log.info(
      {
        user: {
          userId: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        accessToken,
      },
      'User logged in successfully.',
    );

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
      })
      .code(201)
      .send({
        user: { username: user.username, email: user.email, role: user.role },
        accessToken,
      });
  } catch (error) {
    app.log.error(error, 'Error during user login.');
    throw error;
  }
}
