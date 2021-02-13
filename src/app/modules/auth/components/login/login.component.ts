import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm!: FormGroup;
  email!: FormControl;
  password!: FormControl;
  hidePasswordInput: boolean;
  authSub!: Subscription;
  loading: boolean;

  constructor(private authService: AuthService, private matSnckBar: MatSnackBar, private router: Router) {
    this.hidePasswordInput = true;
    this.loading = false;
  }

  ngOnInit(): void {
    this.email = new FormControl('', [Validators.required, this.validateEmail]);
    this.password = new FormControl('', Validators.required);
    this.loginForm = new FormGroup({ email: this.email, password: this.password });
  }

  onSubmit = () => {
    if (this.loginForm.valid) {
      this.loginForm.disable();
      this.loading = true;
      this.authSub = this.authService.logIn(this.email.value, this.password.value)
        // tslint:disable-next-line: deprecation
        .subscribe(
          // tslint:disable-next-line: variable-name
          _data => {
            this.openSnackBar('Login Successful!');
            this.router.navigate(['dashboard']);
          },
          error => {
            this.loading = false;
            this.loginForm.enable();
            this.openSnackBar(error);
          }
        );
    }
  }

  validateEmail = (control: AbstractControl) => /\S+@\S+\.\S+/.test(control.value) ? null : { invalidEmail: true };

  ngOnDestroy(): void {
    if (this.authSub !== undefined) {
      this.authSub.unsubscribe();
    }
  }

  openSnackBar = (message: string) => this.matSnckBar.open(message, 'X', { duration: 3000 });

}
