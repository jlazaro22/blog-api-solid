import config from 'config';
import Blog, { IBlog } from 'models/blog';
import { Document, Types } from 'mongoose';
import { IBlogsRepository } from 'repositories/blogs-repository';

export class MongooseBlogsRepository implements IBlogsRepository {
  async findAllByUserId(
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

  async count(query: { status?: 'draft' | 'published' }): Promise<number> {
    const count = await Blog.countDocuments(query);

    return count;
  }

  async findAll(
    query: { status?: 'draft' | 'published' },
    limit?: number,
    offset?: number,
  ): Promise<IBlog[] | null> {
    const blogs = await Blog.find(query)
      .select('-banner.publicId -__v')
      .populate('author', '-createdAt -updatedAt -__v')
      .limit(limit || config.defaultResLimit)
      .skip(offset || config.defaultResOffset)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return blogs;
  }

  async countByAuthor(
    authorId: string,
    query: { status?: 'draft' | 'published' },
  ): Promise<number> {
    const id = new Types.ObjectId(authorId);
    const count = await Blog.countDocuments({ author: id, ...query });

    return count;
  }

  async findAllByAuthor(
    authorId: string,
    query: { status?: 'draft' | 'published' },
    limit?: number,
    offset?: number,
  ): Promise<IBlog[] | null> {
    const id = new Types.ObjectId(authorId);
    const blogs = await Blog.find({ author: id, ...query })
      .select('-banner.publicId -__v')
      .populate('author', '-createdAt -updatedAt -__v')
      .limit(limit || config.defaultResLimit)
      .skip(offset || config.defaultResOffset)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return blogs;
  }

  async findById(id: string): Promise<IBlog | null> {
    const blog = await Blog.findById(id).select('-__v').exec();

    return blog;
  }

  async findBySlug(slug: string): Promise<IBlog | null> {
    const blog = await Blog.findOne({ slug })
      .select('-banner.publicId -__v')
      .populate('author', '-createdAt -updatedAt -__v')
      .lean()
      .exec();

    return blog;
  }

  async create(data: IBlog): Promise<IBlog> {
    const blog = await Blog.create(data);

    return blog;
  }

  async save(
    blog: Document<unknown, {}, IBlog, {}, {}> & IBlog,
  ): Promise<IBlog> {
    await blog.save();

    return blog;
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    await Blog.deleteMany({ author: userId });
  }
}
