import { IUser } from 'models/user';
import { IUsersRepository } from 'repositories/users-repository';
import { CustomError } from 'use-cases/errors/custom-error';

interface IGetUserByIdUseCaseRequest {
  userId: string;
}

interface IGetUserByIdUseCaseResponse {
  user: IUser | null;
}

export class GetUserByIdUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    userId,
  }: IGetUserByIdUseCaseRequest): Promise<IGetUserByIdUseCaseResponse> {
    const user = await this.usersRepository.findById(userId, false);

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
