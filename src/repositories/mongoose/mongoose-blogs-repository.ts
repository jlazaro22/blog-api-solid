import Blog, { IBlog } from 'models/blog';
import { Document, Types } from 'mongoose';
import { IBlogsRepository } from 'repositories/blogs-repository';

export class MongooseBlogsRepository implements IBlogsRepository {
  async findByUserId(
    userId: string,
    useLean: boolean = true,
    select?: string,
  ): Promise<
    | (Document<unknown, {}, IBlog, {}, {}> &
        IBlog & {
          _id: Types.ObjectId;
        } & {
          __v: number;
        })[]
    | null
  > {
    const id = new Types.ObjectId(userId);
    const query = Blog.find({ author: id }).select(select || '-__v');

    if (useLean) query.lean();

    const blogs = await query.exec();

    return blogs;
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    await Blog.deleteMany({ author: userId });
  }
}
