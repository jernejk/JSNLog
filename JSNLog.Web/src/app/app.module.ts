import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule, ErrorHandler } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { PageWithErrorComponent } from './page-with-error/page-with-error.component';
import { JL } from 'jsnlog';
import { LogService } from './services/log.service';
import { UncaughtExceptionHandler } from './services/uncaught-exception-handler';

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
    { provide: 'JSNLOG', useValue: JL },
    { provide: ErrorHandler, useClass: UncaughtExceptionHandler },
    LogService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
