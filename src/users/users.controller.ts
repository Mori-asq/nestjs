import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { multerOptions } from 'src/helpers/multer.config';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @HttpCode(200)
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  @HttpCode(201)
  createUser(@Body() body: CreateUserDto) {
    return this.usersService.createUser(body);
  }

  @Get(':id')
  @HttpCode(200)
  findUserById(@Param('id') id: string) {
    return this.usersService.findUserById(+id);
  }

  @Put(':id')
  @HttpCode(200)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Post('upload_avatar')
  @UseInterceptors(FileInterceptor('avatar', multerOptions))
  uploadAvatar(@UploadedFile() avatarFile: any) {
    return this.usersService.uploadAvatar(avatarFile);
  }
}
