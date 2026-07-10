import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserEntity } from './entities/user.entity';
import { appConfig, IAppConfig } from '../config/app.config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
    @Inject(appConfig.KEY)
    private readonly appConfiguration: IAppConfig,
  ) {}

  async findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  async findById(id: string) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const entity = this.repo.create(createUserDto as UserEntity);
    return this.repo.save(entity);
  }

  async findAll() {
    return this.repo.find();
  }

  async findOne(id: string) {
    return this.findById(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.repo.update({ id }, updateUserDto as Partial<UserEntity>);
    return this.findById(id);
  }

  async remove(id: string) {
    const user = await this.findById(id);
    return this.repo.remove(user);
  }

  async updatePassword(id: string, dto: ChangePasswordDto) {
    const user = await this.findById(id);

    const isOldPasswordValid = await bcrypt.compare(
      dto.oldPassword,
      user.password,
    );

    if (!isOldPasswordValid) {
      throw new UnauthorizedException('Неверный текущий пароль');
    }

    const hashedPassword = await bcrypt.hash(
      dto.newPassword,
      this.appConfiguration.hashSalt,
    );
    await this.repo.update({ id }, { password: hashedPassword });
  }
}
