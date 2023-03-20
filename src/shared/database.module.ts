import { DynamicModule, Module } from '@nestjs/common';

@Module({
  imports: [],
})
export class DatabaseModule {
  public static forRoot(entities?: any[]): DynamicModule {
    return {} as DynamicModule;
  }
}
