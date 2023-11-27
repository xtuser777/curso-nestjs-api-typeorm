import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import { UserService } from './user.service';
import { Roles } from '../decorators/role.decorator';
import { Role } from '../enums/role.enum';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { LogInterceptor } from '../interceptors/log.interceptor';
import { ParamId } from '../decorators/param-id.decorator';

@Roles(Role.Admin)
@UseGuards(AuthGuard, RoleGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  public async create(@Body() data: CreateUserDTO) {
    if (await this.userService.existsEmail(data.email)) {
      throw new BadRequestException('E-mail já existe.');
    }
    return this.userService.create(data);
  }

  @UseInterceptors(LogInterceptor)
  @Get()
  public async index() {
    return this.userService.read();
  }

  @Get(':id')
  public async show(@ParamId() id: number) {
    return this.userService.readOne(id);
  }

  @Put(':id')
  public async update(@ParamId() id: number, @Body() data: UpdatePutUserDTO) {
    return this.userService.update(id, data);
  }

  @Patch(':id')
  public async updatePartial(
    @ParamId() id: number,
    @Body() data: UpdatePatchUserDTO,
  ) {
    return this.userService.updatePartial(id, data);
  }

  @Delete(':id')
  public async delete(@ParamId() id: number) {
    return {
      success: await this.userService.delete(id),
    };
  }
}
