import { app } from 'app';
import { IBlogsRepository } from 'repositories/blogs-repository';
import { ILikesRepository } from 'repositories/likes-repository';
import { CustomError } from 'use-cases/errors/custom-error';

interface IUnlikeBlogUseCaseRequest {
  userId: string;
  blogId: string;
}

export class UnlikeBlogUseCase {
  constructor(
    private blogsRepository: IBlogsRepository,
    private likesRepository: ILikesRepository,
  ) {}

  async execute({ userId, blogId }: IUnlikeBlogUseCaseRequest): Promise<void> {
    const existingLike = await this.likesRepository.findOneByBlogIdAndUserId(
      blogId,
      userId,
    );

    if (!existingLike) {
      throw new CustomError({
        httpCode: 404,
        code: 'NotFoundError',
        message: 'Like not found.',
      });
    }

    await this.likesRepository.delete(existingLike._id);

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

    blog.likesCount ? blog.likesCount-- : (blog.likesCount = 0);
    await this.blogsRepository.save(blog);
    app.log.info(
      { userId, blogId: blog._id, likesCount: blog.likesCount },
      'Blog unliked successfully.',
    );
  }
}
