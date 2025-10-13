import { IUser } from 'models/user';
import { IUsersRepository } from 'repositories/users-repository';

interface IGetAllUsersUseCaseRequest {
  limit?: number | undefined;
  offset?: number | undefined;
}

interface IGetAllUsersUseCaseResponse {
  usersCount: number;
  users: IUser[] | null;
}

export class GetAllUsersUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    limit,
    offset,
  }: IGetAllUsersUseCaseRequest): Promise<IGetAllUsersUseCaseResponse> {
    const usersCount = await this.usersRepository.count();
    const users = await this.usersRepository.findAll(limit, offset);

    return { usersCount, users };
  }
}
