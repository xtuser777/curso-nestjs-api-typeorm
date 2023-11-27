import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async create({ name, email, password, birth, role }: CreateUserDTO) {
    password = await bcrypt.hash(password, await bcrypt.genSalt());
    let dateBirth = null;
    if (birth) dateBirth = new Date(birth);
    return this.userRepository.save({
      name,
      email,
      password,
      birth: dateBirth,
      role,
    });
  }

  public async read() {
    return this.userRepository.find();
  }

  public async readOne(id: number) {
    await this.exists(id);
    return this.userRepository.findOne({ where: { id } });
  }

  public async update(
    id: number,
    { name, email, password, birth, role }: UpdatePutUserDTO,
  ) {
    await this.exists(id);
    password = await bcrypt.hash(password, await bcrypt.genSalt());
    let dateBirth = null;
    if (birth) dateBirth = new Date(birth);
    await this.userRepository.update(id, {
      name,
      email,
      password,
      birth: dateBirth,
      role,
    });
    return this.readOne(id);
  }

  public async updatePartial(
    id: number,
    { name, email, password, birth, role }: UpdatePatchUserDTO,
  ) {
    await this.exists(id);
    const data: any = {};
    if (birth) data.birth = new Date(birth);
    if (name) data.name = name;
    if (email) data.email = email;
    if (password)
      data.password = await bcrypt.hash(password, await bcrypt.genSalt());
    if (role) data.role = role;
    await this.userRepository.update(id, data);
    return this.readOne(id);
  }

  public async delete(id: number) {
    await this.exists(id);
    const result = await this.userRepository.delete(id);
    return result.affected > 0;
  }

  public async exists(id: number) {
    if (!(await this.userRepository.exist({ where: { id } }))) {
      throw new NotFoundException(`Usuário ${id} não existe.`);
    }
  }

  public async existsEmail(email: string) {
    return await this.userRepository.exist({ where: { email } });
  }
}
