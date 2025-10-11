import { compare } from 'bcryptjs';
import { IUser } from 'models/user';
import { Types } from 'mongoose';
import { IUsersRepository } from 'repositories/users-repository';
import { CustomError } from 'use-cases/errors/custom-error';

interface ILoginUseCaseRequest {
  email: string;
  password: string;
}

interface ILoginUseCaseResponse {
  user:
    | IUser & {
        _id: Types.ObjectId;
      };
}

export class LoginUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    email,
    password,
  }: ILoginUseCaseRequest): Promise<ILoginUseCaseResponse> {
    const user = await this.usersRepository.findOneByEmail(email);

    if (!user) {
      throw new CustomError({
        httpCode: 401,
        code: 'AuthenticationError',
        message: 'Invalid credentials.',
      });
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new CustomError({
        httpCode: 401,
        code: 'AuthenticationError',
        message: 'Invalid credentials.',
      });
    }

    return { user };
  }
}
