import { ForbiddenError } from '@casl/ability';
import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  AbilityFactory,
  Action,
  AppAbility,
} from 'src/ability/ability.factory';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private abilityFactory: AbilityFactory) {}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    const user = new User();
    user.id = id;
    user.orgId = id;
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto, user: User) {
    const ability = this.abilityFactory.defineAbility(user);
    const userToUpdate = this.findOne(+id);
    try {
      ForbiddenError.from(ability).throwUnlessCan(Action.Update, userToUpdate);
      return `This action updates a #${id} user`;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
