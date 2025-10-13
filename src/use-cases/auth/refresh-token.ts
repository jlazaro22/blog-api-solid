import { ITokensRepository } from 'repositories/tokens-repository';

interface IRefreshTokenUseCaseRequest {
  userId: string;
  refreshToken: string;
}

export class RefreshTokenUseCase {
  constructor(private tokensRepository: ITokensRepository) {}

  async execute({
    userId,
    refreshToken,
  }: IRefreshTokenUseCaseRequest): Promise<void> {
    await this.tokensRepository.deleteAllByUserId(userId);
    await this.tokensRepository.create(refreshToken, userId);
  }
}
