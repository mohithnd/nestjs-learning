import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/currentUser.decorator';
import { User } from './users.entity';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get('whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('signout')
  signout(@Session() session: any) {
    session.userId = null;
  }

  @Post('signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAllUsers(@Query('email') email: string) {
    const users = await this.usersService.find(email);
    if (!users || users.length == 0) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
    return users;
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async removeUser(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.remove(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ) {
    if (body.password) {
      const result = await this.authService.hashPassword(body.password);
      body.password = result;
    }
    return await this.usersService.update(id, body);
  }
}
