import { IBlog } from 'models/blog';
import { IBlogsRepository } from 'repositories/blogs-repository';
import { IUsersRepository } from 'repositories/users-repository';

interface IQueryType {
  status?: 'draft' | 'published';
}

interface IGetBlogsByAuthorUseCaseRequest {
  userId: string;
  authorId: string;
  limit?: number | undefined;
  offset?: number | undefined;
}

interface IGetBlogsByAuthorUseCaseResponse {
  total: number;
  blogs: IBlog[] | null;
}

export class GetBlogsByAuthorUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private blogsRepository: IBlogsRepository,
  ) {}

  async execute({
    userId,
    authorId,
    limit,
    offset,
  }: IGetBlogsByAuthorUseCaseRequest): Promise<IGetBlogsByAuthorUseCaseResponse> {
    const user = await this.usersRepository.findById(userId, true, 'role');

    const query: IQueryType = {};

    if (user?.role === 'user') {
      query.status = 'published';
    }

    const total = await this.blogsRepository.countByAuthor(authorId, query);
    const blogs = await this.blogsRepository.findAllByAuthor(
      authorId,
      query,
      limit,
      offset,
    );

    return { total, blogs };
  }
}
