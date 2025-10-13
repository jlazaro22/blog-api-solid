import { app } from 'app';
import { uploadToCloudinary } from 'lib/cloudinary';
import { IBlog } from 'models/blog';
import { Types } from 'mongoose';
import { IBlogsRepository } from 'repositories/blogs-repository';
import { CustomError } from 'use-cases/errors/custom-error';

interface ICreateBlogUseCaseRequest {
  userId: string;
  fileBuffer: Buffer<ArrayBufferLike>;
  title: string;
  content: string;
  status: IBlog['status'];
}

interface ICreateBlogUseCaseResponse {}

export class CreateBlogUseCase {
  constructor(private blogsRepository: IBlogsRepository) {}

  async execute({
    userId,
    fileBuffer,
    title,
    content,
    status,
  }: ICreateBlogUseCaseRequest): Promise<ICreateBlogUseCaseResponse> {
    const data = await uploadToCloudinary(fileBuffer, '');

    if (!data) {
      app.log.error('Error while uploading blog banner image to cloudinary.');

      throw new CustomError({
        httpCode: 500,
        code: 'ServerError',
        message: 'Internal server error.',
      });
    }

    const banner: IBlog['banner'] = {
      publicId: data.public_id,
      url: data.url,
      width: data.width,
      height: data.height,
    };

    const blog = this.blogsRepository.create({
      title,
      content,
      banner,
      status,
      author: new Types.ObjectId(userId),
    });

    return blog;
  }
}
