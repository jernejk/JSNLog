import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { JL } from 'jsnlog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string;
  password: string;

  constructor(private router: Router/*, @Inject('JSNLOG') private logger: JL.JSNLog*/) { }

  ngOnInit() {
  }

  public login() {
    // this.logger().info(`User ${this.email} is logged in`);
    this.router.navigate(['/']);
  }

  public cancel() {
    this.router.navigate(['/']);
  }

}
