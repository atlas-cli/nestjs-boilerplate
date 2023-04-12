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
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { infinityPagination } from './../common/utils/infinity-pagination';
import { Types } from 'mongoose';
import { UseAbility } from './../common/access-control/decorators/use-ability.decorator';
import { Actions } from './../common/access-control/types/actions';
import { AuthGuard } from '@nestjs/passport';
import { AccessControlGuard } from './../common/access-control/access-control.guard';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), AccessControlGuard)
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
  @UseAbility('users', Actions.read)
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Request() request,
  ) {
    console.log(request.conditions);
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
  @Get(':id')
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
