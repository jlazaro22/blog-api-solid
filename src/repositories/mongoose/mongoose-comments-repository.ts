import Comment, { IComment } from 'models/comment';
import { Types } from 'mongoose';
import { ICommentsRepository } from 'repositories/comments-repository';

export class MongooseCommentsRepository implements ICommentsRepository {
  async create(data: IComment): Promise<IComment> {
    const userId = new Types.ObjectId(data.userId);
    const blogId = new Types.ObjectId(data.blogId);

    const comment = await Comment.create({
      blogId,
      userId,
      content: data.content,
    });

    return comment;
  }
}
