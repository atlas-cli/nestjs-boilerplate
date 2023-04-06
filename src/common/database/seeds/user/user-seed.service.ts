import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../../../users/models/user.model';
import { TESTER_PASSWORD } from './../../constants';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectModel(User.name) private repository: Model<UserDocument>,
  ) {}

  async run() {
    const countUser = await this.repository.count({});

    if (countUser === 0) {
      await this.repository.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: TESTER_PASSWORD,
      });
    }
  }
}
