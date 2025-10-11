import { FastifyReply, FastifyRequest } from 'fastify';

import { app } from 'app';
import { env } from 'env';
import { MongooseTokensRepository } from 'repositories/mongoose/mongoose-tokens-repository';

export async function logout(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const userId = request.user.sub;

  try {
    const tokensRepository = new MongooseTokensRepository();

    await tokensRepository.deleteAllByUserId(userId);

    app.log.info(
      {
        userId,
      },
      'User logged out successfully.',
    );

    reply
      .clearCookie('refreshToken', {
        path: '/',
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
      })
      .code(204);
  } catch (error) {
    app.log.error(error, 'Error during user logout.');
    throw error;
  }
}
