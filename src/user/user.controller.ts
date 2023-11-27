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
import { LogInterceptor } from 'src/interceptors/log.interceptor';
import { ParamId } from 'src/decorators/param-id.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';

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
    return this.userService.delete(id);
  }
}
