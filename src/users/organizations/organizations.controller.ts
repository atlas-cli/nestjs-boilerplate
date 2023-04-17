import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AccessControlGuard } from './../../common/access-control/access-control.guard';
import { UseAbility } from './../../common/access-control/decorators/use-ability.decorator';
import { Action } from './../../common/access-control/types/action';
import { ResourceCondition } from './../../common/access-control/decorators/resource-condition.decorator';
import { ResourceConditions } from './../../common/access-control/types/resource-condition';
import { infinityPagination } from './../../common/utils/infinity-pagination';
import { Organization } from './models/organization.model';
import { MongooseSerializerInterceptor } from './../../common/interceptors/mongoose/serializer.interceptor';

@ApiBearerAuth()
@UseInterceptors(MongooseSerializerInterceptor(Organization))
@UseGuards(AuthGuard('jwt'), AccessControlGuard)
@ApiTags('Organizations')
@Controller('users/organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  @UseAbility('organizations', Action.create)
  @HttpCode(HttpStatus.OK)
  create(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @Request() request,
  ) {
    return this.organizationsService.create(
      createOrganizationDto,
      request.user,
    );
  }

  @Get()
  @UseAbility('organizations', Action.read)
  async findAll(
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @ResourceCondition() resource: ResourceConditions,
  ) {
    const condition = resource.toMongoFindNoOwn('_id', 'owner');

    if (limit > 50) {
      limit = 50;
    }
    const skip = page * limit;

    return infinityPagination(
      await this.organizationsService.findManyWithPagination(
        {
          skip,
          limit,
        },
        condition,
      ),
      { skip, limit },
    );
  }

  @Get(':id')
  @UseAbility('organizations', Action.read)
  findOne(
    @Param('id') id: string,
    @ResourceCondition() resource: ResourceConditions,
  ) {
    // valid have access to this resource
    resource.toMongoFindOne(id, '_id');
    return this.organizationsService.findOne(id);
  }

  @Patch(':id')
  @UseAbility('organizations', Action.update)
  async update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    await this.organizationsService.update(id, updateOrganizationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationsService.remove(id);
  }
}
