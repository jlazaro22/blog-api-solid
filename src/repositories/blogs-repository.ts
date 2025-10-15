import { IBlog } from 'models/blog';
import { Document, Types } from 'mongoose';

export interface IBlogsRepository {
  findAllByUserId(
    userId: string,
    useLean?: boolean,
    select?: string,
  ): Promise<
    | (Document<unknown, {}, IBlog, {}, {}> &
        IBlog & {
          _id: Types.ObjectId;
        } & {
          __v: number;
        })[]
    | null
  >;

  count(query: { status?: 'draft' | 'published' }): Promise<number>;

  findAll(
    query: { status?: 'draft' | 'published' },
    limit?: number,
    offset?: number,
  ): Promise<IBlog[] | null>;

  countByAuthor(
    authorId: string,
    query: { status?: 'draft' | 'published' },
  ): Promise<number>;

  findAllByAuthor(
    authorId: string,
    query: { status?: 'draft' | 'published' },
    limit?: number,
    offset?: number,
  ): Promise<IBlog[] | null>;

  findById(
    id: string,
    useLean?: boolean,
    select?: string,
  ): Promise<
    | (Document<unknown, {}, IBlog, {}, {}> &
        IBlog & {
          _id: Types.ObjectId;
        } & {
          __v: number;
        })
    | null
  >;

  findBySlug(slug: string): Promise<IBlog | null>;

  create(data: IBlog): Promise<IBlog>;

  save(blog: Document<unknown, {}, IBlog, {}, {}> & IBlog): Promise<IBlog>;

  deleteAllByUserId(userId: string): Promise<void>;

  delete(id: string): Promise<void>;
}
