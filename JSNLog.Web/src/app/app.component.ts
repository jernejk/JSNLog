import { Component } from '@angular/core';
import { LogService } from './services/log.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private log: LogService) {
    // In main.ts we silence JSNLog to ensure that bootstrapping errors are not swallowed.
    // Here we can reconfigure JSNLog with correct URL, desired log level or even disable logs.
    // By default the log is disabled which means it's not necessary to call init with `isLogEnabled = false`
    log.init('http://localhost:51213/jsnlog.logger', 'ALL');
    log.info('Angular is starting...');
  }
}
