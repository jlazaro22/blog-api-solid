import { app } from 'app';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { IComment } from 'models/comment';
import { Types } from 'mongoose';
import { IBlogsRepository } from 'repositories/blogs-repository';
import { ICommentsRepository } from 'repositories/comments-repository';
import { CustomError } from 'use-cases/errors/custom-error';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

interface ICommentBlogUseCaseRequest {
  userId: string;
  blogId: string;
  content: string;
}

interface ICommentBlogUseCaseResponse {
  comment: IComment;
}

export class CommentBlogUseCase {
  constructor(
    private commentsRepository: ICommentsRepository,
    private blogsRepository: IBlogsRepository,
  ) {}

  async execute({
    userId,
    blogId,
    content,
  }: ICommentBlogUseCaseRequest): Promise<ICommentBlogUseCaseResponse> {
    const blog = await this.blogsRepository.findById(
      blogId,
      false,
      '_id commentsCount',
    );

    if (!blog) {
      throw new CustomError({
        httpCode: 404,
        code: 'NotFoundError',
        message: 'Blog not found.',
      });
    }

    const cleanContent = purify.sanitize(content);

    const comment = await this.commentsRepository.create({
      blogId: new Types.ObjectId(blogId),
      userId: new Types.ObjectId(userId),
      content: cleanContent,
    });
    app.log.info(comment, 'New comment created.');

    blog.commentsCount ? blog.commentsCount++ : (blog.commentsCount = 1);
    await this.blogsRepository.save(blog);

    return {
      comment,
    };
  }
}
