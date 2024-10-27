import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Users from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly user_repository: Repository<Users>,
  ) {}

  findAll = async () => {
    return await this.user_repository.find();
  };

  createUser = async (data: CreateUserDto) => {
    const user = await this.user_repository.create(data);
    this.user_repository.save(user);
    return user;
  };

  findUserById = async (id: number) => {
    const user = await this.user_repository.findOne({
      where: {
        id,
      },
    });

    if (!user) throw new HttpException(`USER NOT FOUND!`, 404);

    return user;
  };

  findUserByEmail = async (email: string) => {
    const user = await this.user_repository.findOne({
      where: { email: email },
    });

    if (!user) throw new HttpException(`USER NOT FOUND!`, 404);

    return user;
  };

  update = async (id: number, updateUserDto: UpdateUserDto) => {
    const user = await this.user_repository.findOne({
      where: {
        id,
      },
    });

    if (!user) throw new HttpException(`USER NOT FOUND!`, 404);

    await this.user_repository.update({ id }, { ...updateUserDto });

    return { message: `USER ${id} UPDATED SUCCESSFULLY!` };
  };

  remove = async (id: number) => {
    const user = await this.user_repository.findOne({
      where: {
        id,
      },
    });

    if (!user) throw new HttpException(`USER NOT FOUND!`, 404);

    await this.user_repository.delete(id);
    return { message: `USER ${id} DELETED SUCCESSFULLY!` };
  };

  uploadAvatar = async (avatarFile: any) => {
    const url = await (avatarFile.path as string).replace('static', '');
    return { url: url || '' };
  };
}
