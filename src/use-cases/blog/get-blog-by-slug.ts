import { app } from 'app';
import { IBlog } from 'models/blog';
import { IBlogsRepository } from 'repositories/blogs-repository';
import { IUsersRepository } from 'repositories/users-repository';
import { CustomError } from 'use-cases/errors/custom-error';

interface IGetBlogBySlugUseCaseRequest {
  userId: string;
  slug: string;
}

interface IGetBlogBySlugUseCaseResponse {
  blog: IBlog;
}

export class GetBlogBySlugUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private blogsRepository: IBlogsRepository,
  ) {}

  async execute({
    userId,
    slug,
  }: IGetBlogBySlugUseCaseRequest): Promise<IGetBlogBySlugUseCaseResponse> {
    const user = await this.usersRepository.findById(userId, true, 'role');

    const blog = await this.blogsRepository.findBySlug(slug);

    if (!blog) {
      throw new CustomError({
        httpCode: 404,
        code: 'NotFoundError',
        message: 'Blog not found.',
      });
    }

    if (user?.role === 'user' && blog.status === 'draft') {
      app.log.error({ userId, blog }, 'A user tried to access a draft blog.');

      throw new CustomError({
        httpCode: 403,
        code: 'AuthorizationError',
        message: 'Access denied, insufficient permissions.',
      });
    }

    return { blog };
  }
}
