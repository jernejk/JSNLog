import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule, ErrorHandler } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { PageWithErrorComponent } from './page-with-error/page-with-error.component';
// import { JL } from 'jsnlog';

// // Logging stuff
// class UncaughtExceptionHandler implements ErrorHandler {
//   handleError(error: any) {
//       JL().fatalException('Uncaught Exception', error);
//       console.warn('logged');
//   }
// }

// const logLevel = JL.getAllLevel();
// const appender = JL.createAjaxAppender('example appender');
// appender.setOptions({
//     'bufferSize': 20,
//     'storeInBufferLevel': 1000,
//     'level': logLevel,
//     'sendWithBufferLevel': 6000,
//     'url': 'http://localhost:51213/jsnlog.logger'
// });

// // Configure the JSNLog logging library.
// // See http://jsnlog.com/Documentation/JSNLogJs
// JL().setOptions({
//     'appenders': [appender],
//     'level': logLevel
// });

// JL().info('Angular is starting...');

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'page-with-error', component: PageWithErrorComponent },
  { path: '', component: WelcomeComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    WelcomeComponent,
    PageWithErrorComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    CommonModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    // { provide: 'JSNLOG', useValue: JL },
    // { provide: ErrorHandler, useClass: UncaughtExceptionHandler }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
