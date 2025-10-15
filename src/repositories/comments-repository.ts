import { IComment } from 'models/comment';

export interface ICommentsRepository {
  findAllByBlogId(blogId: string): Promise<IComment[] | null>;

  findById(commentId: string): Promise<IComment | null>;

  create(data: IComment): Promise<IComment>;

  delete(commentId: string): Promise<void>;
}
