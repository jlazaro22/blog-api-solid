import { app } from 'app';
import { uploadToCloudinary } from 'lib/cloudinary';
import { IBlog } from 'models/blog';
import { Types } from 'mongoose';
import { IBlogsRepository } from 'repositories/blogs-repository';
import { IUsersRepository } from 'repositories/users-repository';
import { CustomError } from 'use-cases/errors/custom-error';

interface IUpdateBlogUseCaseRequest {
  userId: string;
  blogId: string;
  fileBuffer?: Buffer<ArrayBufferLike> | undefined;
  title?: string | undefined;
  content?: string | undefined;
  status: IBlog['status'] | undefined;
}

interface IUpdateBlogUseCaseResponse {
  blog: IBlog;
}

export class UpdateBlogUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private blogsRepository: IBlogsRepository,
  ) {}

  async execute({
    userId,
    blogId,
    fileBuffer,
    title,
    content,
    status,
  }: IUpdateBlogUseCaseRequest): Promise<IUpdateBlogUseCaseResponse> {
    const user = await this.usersRepository.findById(userId, true, 'role');
    const blog = await this.blogsRepository.findById(blogId, false);

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

    if (fileBuffer) {
      const publicId = blog.banner.publicId;
      const data = await uploadToCloudinary(
        fileBuffer,
        publicId ? publicId.replace('blog-api/', '') : '',
      );

      if (!data) {
        app.log.error('Error while uploading blog banner image to cloudinary.');

        throw new CustomError({
          httpCode: 500,
          code: 'ServerError',
          message: 'Internal server error.',
        });
      }

      blog.banner = {
        publicId: data.public_id,
        url: data.url,
        width: data.width,
        height: data.height,
      };
    }

    if (title) blog.title = title;
    if (content) blog.content = content;
    if (status) blog.status = status;

    await this.blogsRepository.save(blog);
    app.log.info({ blog }, 'Blog updated successfully.');

    return { blog };
  }
}
