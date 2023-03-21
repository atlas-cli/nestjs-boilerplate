import {
  AsyncModelFactory,
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { AuthProvidersEnum } from './../../auth/auth-providers.enum';
import * as bcrypt from 'bcryptjs';
import { Exclude, Expose } from 'class-transformer';
import { HydratedDocument } from 'mongoose';
import { ConfigService } from '@nestjs/config';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ unique: true, isRequired: false, index: true })
  email: string | null;

  @Prop({ isRequired: false })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Exclude({ toPlainOnly: true })
  public previousPassword: string;

  @Prop({ default: AuthProvidersEnum.email })
  @Expose({ groups: ['exposeProvider'] })
  provider: string;

  @Prop({ isRequired: false, index: true })
  socialId: string | null;

  @Prop({ isRequired: false, index: true })
  firstName: string | null;

  @Prop({ isRequired: false, index: true })
  lastName: string | null;

  @Prop({
    type: Object,
  })
  userMetadata: any;

  //   @ManyToOne(() => Role, {
  //     eager: true,
  //   })
  //   role?: Role | null;

  //   @ManyToOne(() => Status, {
  //     eager: true,
  //   })
  //   status?: Status;

  @Prop({ isRequired: true, index: true })
  @Exclude({ toPlainOnly: true })
  hash: string | null;
}

export const UserSchema = SchemaFactory.createForClass(User);

export const UserFactory: AsyncModelFactory = {
  name: User.name,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const schema = UserSchema;
    schema.pre('save', function (next) {
      // only hash the password if it has been modified (or is new)
      if (!this.isModified('password')) return next();

      // generate a salt
      bcrypt.genSalt(configService.get('auth.secret'), (err, salt) => {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(this.password, salt, (err, hash) => {
          if (err) return next(err);
          // override the cleartext password with the hashed one
          this.password = hash;
          next();
        });
      });
    });
    return schema;
  },
};
