import { app } from 'app';
import { Types } from 'mongoose';
import { IBlogsRepository } from 'repositories/blogs-repository';
import { ICommentsRepository } from 'repositories/comments-repository';
import { IUsersRepository } from 'repositories/users-repository';
import { CustomError } from 'use-cases/errors/custom-error';

interface IDeleteCommentUseCaseRequest {
  currentUserId: string;
  commentId: string;
}

export class DeleteCommentUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private blogsRepository: IBlogsRepository,
    private commentsRepository: ICommentsRepository,
  ) {}

  async execute({
    currentUserId,
    commentId,
  }: IDeleteCommentUseCaseRequest): Promise<void> {
    const user = await this.usersRepository.findById(
      currentUserId,
      true,
      'role',
    );

    const comment = await this.commentsRepository.findById(commentId);

    if (!comment) {
      throw new CustomError({
        httpCode: 404,
        code: 'NotFoundError',
        message: 'Comment not found.',
      });
    }

    if (
      comment.userId !== new Types.ObjectId(currentUserId) &&
      user?.role !== 'admin'
    ) {
      app.log.warn(
        { userId: currentUserId, comment },
        'A user tried to delete a comment without permissions.',
      );

      throw new CustomError({
        httpCode: 403,
        code: 'AuthorizationError',
        message: 'Access denied, insufficient permissions.',
      });
    }

    await this.commentsRepository.delete(commentId);
    app.log.info({ commentId }, 'Comment deleted successfully.');

    const blogId = comment.blogId.toString();
    const blog = await this.blogsRepository.findById(
      blogId,
      false,
      'commentsCount',
    );

    if (!blog) {
      throw new CustomError({
        httpCode: 404,
        code: 'NotFoundError',
        message: 'Blog not found.',
      });
    }

    blog.commentsCount ? blog.commentsCount-- : (blog.commentsCount = 0);
    await this.blogsRepository.save(blog);
    app.log.info(
      { blogId: blog._id, commentsCount: blog.commentsCount },
      'Blog comments count updated.',
    );
  }
}
