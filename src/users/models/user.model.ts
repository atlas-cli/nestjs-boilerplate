import {
  AsyncModelFactory,
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { AuthProvidersEnum } from '../../auth/auth-providers.enum';
import * as bcrypt from 'bcryptjs';
import { Exclude, Expose } from 'class-transformer';
import { HydratedDocument, Types } from 'mongoose';
import { UserRoleRelation, UserRoleRelationSchema } from './user-role.relation';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
})
export class User {
  _id: Types.ObjectId;

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

  @Prop({
    type: [UserRoleRelationSchema],
  })
  roles: UserRoleRelation[];

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
  useFactory: () => {
    const schema = UserSchema;
    const bcryptPassword = (command) => {
      return function (next) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let user: any = this;
        if (command === 'save') {
          if (!this.isModified('password')) {
            return next();
          }
        } else {
          if (this._update !== undefined) {
            user = this._update;
            if (user.password === undefined) return next();
          }
        }
        bcrypt.genSalt((err, salt) => {
          if (err) return next(err);
          bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            this.password = hash;
            next();
          });
        });
      };
    };
    schema.pre<User>('save', bcryptPassword('save'));
    schema.pre<User>('updateOne', bcryptPassword('updateOne'));
    return schema;
  },
};
