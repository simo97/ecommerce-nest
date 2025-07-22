import { Module } from '@nestjs/common';


import { APP_INTERCEPTOR} from '@nestjs/core';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

/**
 *
 */

@Module({
  imports: [

  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor
    }
  ],
  exports: [],
})
export class CommonModule {}
