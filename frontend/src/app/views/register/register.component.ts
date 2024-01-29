import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import AuthService from 'src/app/core/services/auth.service';
import HTTPService from 'src/app/core/services/http.service';
import LoginService from '../login/login.service';
import RegisterService, { ILoginResponse } from './register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  public registerForm: FormGroup;
  public isRegistering: boolean = false;
  public error: string | null = null;

  constructor(
    private registerService: RegisterService,
    private router: Router,
    private loginService: LoginService,
    private authService: AuthService,
  ) {
    this.registerForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password1: new FormControl<string>('', [Validators.required, Validators.minLength(6)]),
      password2: new FormControl<string>('', [Validators.required, Validators.minLength(6)]),
    });

    HTTPService.errorSubject.subscribe((error: HttpErrorResponse) => {
      console.log('error', error);
    });
  }

  public register() {
    if (this.registerForm.invalid) {
      if (this.registerForm.controls['name'].errors) {
        this.error = 'You need to enter a username.'
        return;
      }
      if (this.registerForm.controls['email'].errors) {
        this.error = 'You need to enter a valid email.'
        return;
      }
      if (this.registerForm.controls['password1'].errors || this.registerForm.controls['password2'].errors) {
        this.error = 'Your password needs to be at least 6 characters long.'
        return;
      }
      console.log('invalid', this.registerForm.controls['password1'].errors);
    }
    console.log(this.registerForm.value.password1 !== this.registerForm.value.password2, this.registerForm.value.password1, this.registerForm.value.password2);
    if (this.registerForm.value.password1 !== this.registerForm.value.password2) {
      this.error = 'Your passwords do not match!';
      return;
    }
    this.registerService.register(this.registerForm.value.name, this.registerForm.value.email, this.registerForm.value.password1).subscribe((data: HttpResponse<ILoginResponse>) => {
      this.loginService
      .login(this.registerForm.value.email, this.registerForm.value.password1)
      .subscribe((data) => {
        if (data.body) {
          this.authService.adaptLoginData(data.body);
          this.router.navigate(['dashboard']);
        }
      });
    })
  }

}
