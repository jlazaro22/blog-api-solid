import { app } from 'app';
import config from 'config';
import { IUser } from 'models/user';
import { IUsersRepository } from 'repositories/users-repository';
import { CustomError } from 'use-cases/errors/custom-error';
import { generateUsername } from 'utils';

interface IRegisterUseCaseRequest {
  email: string;
  password: string;
  role: IUser['role'];
}

interface IRegisterUseCaseResponse {
  user: IUser;
}

export class RegisterUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    email,
    password,
    role,
  }: IRegisterUseCaseRequest): Promise<IRegisterUseCaseResponse> {
    if (role === 'admin' && !config.WHITELIST_ADMINS_MAIL.includes(email)) {
      app.log.warn(
        `User with email ${email} is trying to register as an admin but is not whitelisted.`,
      );

      throw new CustomError({
        httpCode: 403,
        code: 'AuthorizationError',
        message: ' You can not register as an admin.',
      });
    }

    const userExists = await this.usersRepository.checkEmailExists(email);
    app.log.error(userExists);

    if (userExists) {
      throw new CustomError({
        httpCode: 409,
        code: 'ConflictError',
        message: 'User already exists.',
      });
    }

    const username = generateUsername();

    const user = await this.usersRepository.create({
      username,
      email,
      password,
      role,
    });

    return {
      user,
    };
  }
}
