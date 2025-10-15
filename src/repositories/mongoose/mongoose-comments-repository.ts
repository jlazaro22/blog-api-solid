import Comment, { IComment } from 'models/comment';
import { Types } from 'mongoose';
import { ICommentsRepository } from 'repositories/comments-repository';

export class MongooseCommentsRepository implements ICommentsRepository {
  async findAllByBlogId(blogId: string): Promise<IComment[] | null> {
    const comments = await Comment.find({ blogId })
      .select('-__v')
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return comments;
  }

  async findById(commentId: string): Promise<IComment | null> {
    const comment = await Comment.findById(commentId)
      .select('userId blogId')
      .lean()
      .exec();

    return comment;
  }

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

  async delete(commentId: string): Promise<void> {
    await Comment.deleteOne({ _id: commentId });
  }
}
