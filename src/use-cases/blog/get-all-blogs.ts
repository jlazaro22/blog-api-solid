import { IBlog } from 'models/blog';
import { IBlogsRepository } from 'repositories/blogs-repository';
import { IUsersRepository } from 'repositories/users-repository';

interface QueryType {
  status?: 'draft' | 'published';
}

interface IGetAllBlogsUseCaseRequest {
  userId: string;
  limit?: number | undefined;
  offset?: number | undefined;
}

interface IGetAllBlogsUseCaseResponse {
  total: number;
  blogs: IBlog[] | null;
}

export class GetAllBlogsUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private blogsRepository: IBlogsRepository,
  ) {}

  async execute({
    userId,
    limit,
    offset,
  }: IGetAllBlogsUseCaseRequest): Promise<IGetAllBlogsUseCaseResponse> {
    const user = await this.usersRepository.findById(userId, true, 'role');

    const query: QueryType = {};

    if (user?.role === 'user') {
      query.status = 'published';
    }

    const total = await this.blogsRepository.count(query);
    const blogs = await this.blogsRepository.findAll(query, limit, offset);

    return { total, blogs };
  }
}
