import { IUser } from 'models/user';
import { IUsersRepository } from 'repositories/users-repository';
import { CustomError } from 'use-cases/errors/custom-error';

interface IUpdateCurrentUserUseCaseRequest {
  userId: string;
  userData: {
    username?: string | undefined;
    email?: string | undefined;
    password?: string | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    website?: string | undefined;
    facebook?: string | undefined;
    instagram?: string | undefined;
    x?: string | undefined;
    youtube?: string | undefined;
    linkedin?: string | undefined;
  };
}

interface IUpdateCurrentUserUseCaseResponse {
  user: IUser;
}

export class UpdateCurrentUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    userId,
    userData,
  }: IUpdateCurrentUserUseCaseRequest): Promise<IUpdateCurrentUserUseCaseResponse> {
    const {
      username,
      email,
      password,
      firstName,
      lastName,
      website,
      facebook,
      instagram,
      x,
      youtube,
      linkedin,
    } = userData;

    const user = await this.usersRepository.findByUserId(
      userId,
      false,
      '+password -__v',
    );

    if (!user) {
      throw new CustomError({
        httpCode: 404,
        code: 'NotFoundError',
        message: 'User not found.',
      });
    }

    if (username) {
      const userExists = await this.usersRepository.checkUsernameExists(
        username,
      );

      if (userExists) {
        throw new CustomError({
          httpCode: 409,
          code: 'ConflictError',
          message: 'This username is already in use.',
        });
      }

      user.username = username;
    }

    if (email) {
      const userExists = await this.usersRepository.checkEmailExists(email);

      if (userExists) {
        throw new CustomError({
          httpCode: 409,
          code: 'ConflictError',
          message: 'This email is already in use.',
        });
      }

      user.email = email;
    }

    if (password) user.password = password;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (!user.socialLinks) user.socialLinks = {};
    if (website) user.socialLinks.website = website;
    if (facebook) user.socialLinks.facebook = facebook;
    if (instagram) user.socialLinks.instagram = instagram;
    if (x) user.socialLinks.x = x;
    if (youtube) user.socialLinks.youtube = youtube;
    if (linkedin) user.socialLinks.linkedin = linkedin;

    await user.save();

    return { user };
  }
}
