import { Injectable, ErrorHandler } from '@angular/core';
import { LogService } from './log.service';

@Injectable()
export class UncaughtExceptionHandler implements ErrorHandler {
  constructor(private log: LogService) { }
    handleError(error: any) {
        this.log.logUnhandledException('Uncaught exception', error);

        // IMPORTANT: Rethrow the error otherwise it gets swallowed
        throw error;
    }

}
