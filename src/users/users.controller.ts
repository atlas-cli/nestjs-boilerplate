import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { infinityPagination } from './../common/utils/infinity-pagination';
import { Types } from 'mongoose';
import { UseAbility } from './../common/access-control/decorators/use-ability.decorator';
import { Action } from './../common/access-control/types/action';
import { AuthGuard } from '@nestjs/passport';
import { AccessControlGuard } from './../common/access-control/access-control.guard';
import { ResourceCondition } from './../common/access-control/decorators/resource-condition.decorator';
import { ResourceConditions } from './../common/access-control/types/resource-condition';
import { User } from './models/user.model';
import { MongooseSerializerInterceptor } from './../common/interceptors/mongoose/serializer.interceptor';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), AccessControlGuard)
@UseInterceptors(MongooseSerializerInterceptor(User))
@ApiTags('Users')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @SerializeOptions({
    groups: ['admin'],
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProfileDto: CreateUserDto) {
    return this.usersService.create(createProfileDto);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get()
  @UseAbility('users', Action.read)
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @ResourceCondition() resourceCondition: ResourceConditions,
  ) {
    console.log(
      'example of resourceCondition Find Many',
      resourceCondition.toMongoFind(),
    );
    console.log(
      'example of resourceCondition Find One',
      resourceCondition.toMongoFindOne('64386517a9ca122ffafbb001'),
    );
    if (limit > 50) {
      limit = 50;
    }
    const skip = page * limit;

    return infinityPagination(
      await this.usersService.findManyWithPagination({
        skip,
        limit,
      }),
      { skip, limit },
    );
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  // Get user by ID. Only allow valid ObjectID to prevent route conflicts.
  // URL format: /users/:id, where :id is a valid MongoDB ObjectID.
  @Get(':id([0-9a-fA-F]{24})(/?)')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: Types.ObjectId) {
    return this.usersService.findOne({ _id: id });
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: Types.ObjectId,
    @Body() updateProfileDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: Types.ObjectId) {
    return this.usersService.softDelete(id);
  }
}
