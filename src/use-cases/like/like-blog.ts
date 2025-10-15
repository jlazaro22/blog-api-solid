import { app } from 'app';
import { Types } from 'mongoose';
import { IBlogsRepository } from 'repositories/blogs-repository';
import { ILikesRepository } from 'repositories/likes-repository';
import { CustomError } from 'use-cases/errors/custom-error';

interface ILikeBlogUseCaseRequest {
  userId: string;
  blogId: string;
}

interface ILikeBlogUseCaseResponse {
  likesCount: number;
}

export class LikeBlogUseCase {
  constructor(
    private blogsRepository: IBlogsRepository,
    private likesRepository: ILikesRepository,
  ) {}

  async execute({
    userId,
    blogId,
  }: ILikeBlogUseCaseRequest): Promise<ILikeBlogUseCaseResponse> {
    const blog = await this.blogsRepository.findById(
      blogId,
      false,
      'likesCount',
    );

    if (!blog) {
      throw new CustomError({
        httpCode: 404,
        code: 'NotFoundError',
        message: 'Blog not found.',
      });
    }

    const existingLike = await this.likesRepository.findOneByBlogIdAndUserId(
      blogId,
      userId,
    );

    if (existingLike) {
      throw new CustomError({
        httpCode: 409,
        code: 'ConflictError',
        message: 'You already liked this blog.',
      });
    }

    await this.likesRepository.create({
      blogId: new Types.ObjectId(blogId),
      userId: new Types.ObjectId(userId),
    });

    blog.likesCount ? blog.likesCount++ : (blog.likesCount = 1);
    await this.blogsRepository.save(blog);
    app.log.info({ userId, blogId: blog._id }, 'Blog liked successfully.');

    return { likesCount: blog.likesCount };
  }
}
