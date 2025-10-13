import { v2 as cloudinary } from 'cloudinary';

import { app } from 'app';
import { IBlogsRepository } from 'repositories/blogs-repository';
import { ITokensRepository } from 'repositories/tokens-repository';
import { IUsersRepository } from 'repositories/users-repository';

interface IDeleteCurrentUserUseCaseRequest {
  userId: string;
}

export class DeleteCurrentUserUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private blogsRepository: IBlogsRepository,
    private tokensRepository: ITokensRepository,
  ) {}

  async execute({ userId }: IDeleteCurrentUserUseCaseRequest) {
    const blogs = await this.blogsRepository.findAllByUserId(
      userId,
      true,
      'banner.publicId',
    );

    const publicIds = blogs?.map(({ banner }) => banner.publicId);

    if (publicIds?.length) {
      await cloudinary.api.delete_resources(publicIds);
    }

    app.log.info(
      {
        publicIds,
      },
      'Multiple blog banners deleted from Cloudinary.',
    );

    await this.blogsRepository.deleteAllByUserId(userId);
    app.log.info({ userId, blogs }, 'Multiple blogs deleted.');

    await this.tokensRepository.deleteAllByUserId(userId);
    app.log.info(
      {
        userId,
      },
      'User refresh token deleted successfully.',
    );

    await this.usersRepository.delete(userId);
    app.log.info({ userId }, 'User account deleted successfully.');
  }
}
