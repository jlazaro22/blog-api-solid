import { IUser } from 'models/user';
import { IUsersRepository } from 'repositories/users-repository';
import { CustomError } from 'use-cases/errors/custom-error';

interface IGetCurrentUserUseCaseRequest {
  userId: string;
}

interface IGetCurrentUserUseCaseResponse {
  user: IUser;
}

export class GetCurrentUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    userId,
  }: IGetCurrentUserUseCaseRequest): Promise<IGetCurrentUserUseCaseResponse> {
    const user = await this.usersRepository.findByUserId(userId);

    if (!user) {
      throw new CustomError({
        httpCode: 404,
        code: 'NotFoundError',
        message: 'User not found.',
      });
    }

    return { user };
  }
}
