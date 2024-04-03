import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import LoginService from '../login.service';
import { FormControl, FormGroup } from '@angular/forms';
import AuthService from 'src/app/core/services/auth.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import HTTPService from 'src/app/core/services/http.service';
import { NavigationService } from 'src/app/core/services/navigation.service';

@Component({
  selector: 'app-login',
  host: {
    class: 'center',
  },
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public isRefreshing: boolean = false;
  public error: string | null = null;
  public loggedOut: boolean = false;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private navigationService: NavigationService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl(),
      password: new FormControl(),
    });

    HTTPService.errorSubject.subscribe((error: HttpErrorResponse) => {
      if (this.isRefreshing) {
        this.isRefreshing = false;
        this.loginForm.get('email')?.enable;
        this.loginForm.get('password')?.enable;
      }
      if (error.status >= 500) {
        this.error = 'Server error';
      } else if (error.url?.includes('auth/refresh')) {
        this.error = 'Token expired. Please login again.';
      } else {
        this.error = 'Username/password wrong. Please try again';
      }
    });
  }

  navigate() {
    this.loginService
      .login(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe((data) => {
        if (data.body) {
          this.authService.adaptLoginData(data.body);
          this.router.navigate(['dashboard/',...data.body.startSystem.split('/')]);
        }
      });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if (params['refresh'] === 'refresh') {
        this.loginForm.get('email')?.disable;
        this.loginForm.get('password')?.disable;
        this.isRefreshing = true;
        this.authService.updateToken().subscribe((data) => {
          if (data.status >= 400) {
            this.error = 'Token expired, please log in again.';
          } else if (data.status === 200 && data.body) {
            this.authService.adaptLoginData(data.body);
            this.navigationService.back();
          }
        });
      }
      if (params['refresh'] === 'logout') {
        this.loggedOut = true;
      }
    });
  }
}
