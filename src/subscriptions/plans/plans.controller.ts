import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MongooseSerializerInterceptor } from './../../common/interceptors/mongoose/serializer.interceptor';
import { Plan } from './../models/plan.model';
import { AccessControlGuard } from './../../common/access-control/access-control.guard';
import { PlansService } from './plans.service';
import { infinityPagination } from './../../common/utils/infinity-pagination';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), AccessControlGuard)
@UseInterceptors(MongooseSerializerInterceptor(Plan))
@ApiTags('Plans')
@Controller('subscriptions/plans')
export class PlansController {
  constructor(private plansService: PlansService) {}
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    if (limit > 50) {
      limit = 50;
    }
    const skip = page * limit;
    const response: { data: any[]; products?: any[]; hasNextPage } =
      infinityPagination(
        await this.plansService.findManyWithPagination({
          skip,
          limit,
        }),
        { skip, limit },
      );
    response.products = await this.plansService.findAllProducts();
    return response;
  }
}
