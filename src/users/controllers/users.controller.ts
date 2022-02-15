import { ForbiddenError } from '@casl/ability';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CheckAbilities } from 'src/ability/abilities.decorator';
import { AbilitesGuard } from 'src/ability/abilities.guard';
import { AbilityFactory, Action } from 'src/ability/ability.factory';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { UsersService } from '../services//users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private abilityFactory: AbilityFactory,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    const user = { id: 1, name: 'Ian', isAdmin: false, orgId: 22 };
    const ability = this.abilityFactory.defineAbility(user); // Controll user
    try {
      ForbiddenError.from(ability).throwUnlessCan(Action.Create, User);
      return this.usersService.create(createUserDto);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
    // const isAllowed = ability.can(Action.Create, User);
    // if (!isAllowed) {
    //   throw new ForbiddenException('Only admin');
    // }
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = { id: 1, name: 'Ian', isAdmin: true, orgId: 1 };
    return this.usersService.update(+id, updateUserDto, user);
  }

  @Delete(':id')
  @CheckAbilities({ action: Action.Delete, subject: User })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
