import { DynamicModule, Module, Provider } from '@nestjs/common';
import * as ejs from 'ejs';
@Module({})
export class EjsModule {
  static register(): DynamicModule {
    const EjsProvider: Provider = {
      provide: 'ejs',
      useValue: ejs,
    };
    return {
      module: EjsModule,
      providers: [EjsProvider],
      exports: [EjsProvider],
      global: true,
    };
  }
}
