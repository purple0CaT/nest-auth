import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type Subjects = InferSubjects<typeof User> | 'all';
export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class AbilityFactory {
  defineAbility(user: User) {
    const { can, cannot, build } = new AbilityBuilder(
      Ability as AbilityClass<AppAbility>,
    );
    //
    if (user.isAdmin) {
      can(Action.Manage, 'all');
      cannot(Action.Manage, User, { orgId: { $ne: user.orgId } }).because(
        'You can only manage users in your own organisation!',
      );
    } else {
      can(Action.Read, User);
      cannot(Action.Create, User).because('Only admins allowed!');
      cannot(Action.Delete, User).because('Only admins allowed!');
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
