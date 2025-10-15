import { IComment } from 'models/comment';
import { IBlogsRepository } from 'repositories/blogs-repository';
import { ICommentsRepository } from 'repositories/comments-repository';
import { CustomError } from 'use-cases/errors/custom-error';

interface IGetBlogCommentsUseCaseRequest {
  blogId: string;
}

interface IGetBlogCommentsUseCaseResponse {
  comments: IComment[] | null;
}

export class GetBlogCommentsUseCase {
  constructor(
    private commentsRepository: ICommentsRepository,
    private blogsRepository: IBlogsRepository,
  ) {}

  async execute({
    blogId,
  }: IGetBlogCommentsUseCaseRequest): Promise<IGetBlogCommentsUseCaseResponse> {
    const blog = await this.blogsRepository.findById(blogId, true, '_id');

    if (!blog) {
      throw new CustomError({
        httpCode: 404,
        code: 'NotFoundError',
        message: 'Blog not found.',
      });
    }

    const comments = await this.commentsRepository.findAllByBlogId(blogId);

    return { comments };
  }
}
