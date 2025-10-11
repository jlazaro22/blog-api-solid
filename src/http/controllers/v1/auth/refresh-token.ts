import { FastifyReply, FastifyRequest } from 'fastify';

import { app } from 'app';
import { env } from 'env';
import { MongooseTokensRepository } from 'repositories/mongoose/mongoose-tokens-repository';

export async function refreshToken(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  try {
    await request.jwtVerify({ onlyCookie: true });

    const { sub: userId, role } = request.user;
    const tokensRepository = new MongooseTokensRepository();

    const accessToken = await reply.jwtSign(
      {
        role,
      },
      {
        sign: {
          sub: userId,
          expiresIn: env.ACCESS_TOKEN_EXPIRY,
        },
      },
    );

    const refreshToken = await reply.jwtSign(
      {
        role,
      },
      {
        sign: {
          sub: userId,
          expiresIn: env.REFRESH_TOKEN_EXPIRY,
        },
      },
    );

    await tokensRepository.deleteAllByUserId(userId);
    await tokensRepository.create(refreshToken, userId);

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
      })
      .code(200)
      .send({
        accessToken,
      });
  } catch (error) {
    app.log.error(error, 'Error during refresh token.');
    return reply.code(401).send({ message: 'Unauthorized.' });
  }
}
