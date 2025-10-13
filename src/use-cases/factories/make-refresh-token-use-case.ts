import { MongooseTokensRepository } from 'repositories/mongoose/mongoose-tokens-repository';
import { RefreshTokenUseCase } from 'use-cases/auth/refresh-token';

export function makeRefreshTokenUseCase() {
  const tokensRepository = new MongooseTokensRepository();
  const refreshTokenUseCase = new RefreshTokenUseCase(tokensRepository);

  return refreshTokenUseCase;
}
