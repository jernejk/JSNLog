import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { JL } from 'jsnlog';
import { LogService } from '../services/log.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string;
  password: string;

  constructor(private router: Router, private logger: LogService) { }

  ngOnInit() {
  }

  public login() {
    this.logger.info({
      'action': 'Login',
      'user': this.email,
      'msg':  `User ${this.email} is logged in`
    });

    this.router.navigate(['/']);
  }

  public cancel() {
    this.router.navigate(['/']);
  }

}
