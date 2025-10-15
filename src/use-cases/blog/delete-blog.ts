import { app } from 'app';
import { deleteFromCloudinary } from 'lib/cloudinary';
import { Types } from 'mongoose';
import { IBlogsRepository } from 'repositories/blogs-repository';
import { IUsersRepository } from 'repositories/users-repository';
import { CustomError } from 'use-cases/errors/custom-error';

interface IDeleteBlogUseCaseRequest {
  userId: string;
  blogId: string;
}

export class DeleteBlogUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private blogsRepository: IBlogsRepository,
  ) {}

  async execute({ userId, blogId }: IDeleteBlogUseCaseRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId, true, 'role');
    const blog = await this.blogsRepository.findById(
      blogId,
      false,
      'author banner.publicId',
    );

    if (!blog) {
      throw new CustomError({
        httpCode: 404,
        code: 'NotFoundError',
        message: 'Blog not found.',
      });
    }

    if (blog.author !== new Types.ObjectId(userId) && user?.role !== 'admin') {
      app.log.warn(
        { userId, blog },
        'A user tried to update a blog without permissions.',
      );

      throw new CustomError({
        httpCode: 403,
        code: 'AuthorizationError',
        message: 'Access denied, insufficient permissions.',
      });
    }

    const bannerPublicId = blog.banner.publicId;

    if (bannerPublicId) {
      await deleteFromCloudinary([bannerPublicId]);

      app.log.info(
        {
          bannerPublicId,
        },
        'Blog banner deleted from Cloudinary.',
      );
    }

    await this.blogsRepository.delete(blogId);
    app.log.info({ blogId }, 'Blog deleted successfully.');
  }
}
