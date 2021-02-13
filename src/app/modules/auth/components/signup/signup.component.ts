import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../services/auth/auth.service';
import { PasswordService } from '../../../../services/password/password.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
// tslint:disable: deprecation
// tslint:disable: variable-name
export class SignupComponent implements OnInit, OnDestroy {

  signupForm!: FormGroup;
  name!: FormControl;
  email!: FormControl;
  emailRegex: RegExp;
  password!: FormControl;
  passwordRegx: RegExp;
  passwordRGB: string;
  passwordStrength: string;
  hidePasswordInput: boolean;
  authSub!: Subscription;
  loading: boolean;

  constructor(
    private authService: AuthService,
    private passService: PasswordService,
    private matSnckBar: MatSnackBar,
    private router: Router
  ) {
    this.emailRegex = /\S+@\S+\.\S+/;
    this.passwordRegx = /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%^&*\-_]).{8,}$/;
    this.passwordRGB = 'rgb(255, 0, 0)';
    this.passwordStrength = 'Very Weak';
    this.hidePasswordInput = true;
    this.loading = false;
  }

  ngOnInit(): void {
    this.name = new FormControl('', [Validators.required, Validators.minLength(3)]);
    this.email = new FormControl('', [Validators.required, this.validateEmail]);
    this.password = new FormControl('', [Validators.required, Validators.minLength(8)]);
    this.password.valueChanges.subscribe(value => this.checkPassStrength(value));
    this.signupForm = new FormGroup({ name: this.name, email: this.email, password: this.password });
  }

  onSubmit = () => {
    if (this.signupForm.valid) {
      this.signupForm.disable();
      this.loading = true;
      this.authSub = this.authService.signUp(this.name.value, this.email.value, this.password.value)
        .subscribe(
          _data => {
            this.openSnackBar('Signup Successful!');
            this.router.navigate(['dashboard']);
          },
          error => {
            this.loading = false;
            this.signupForm.enable();
            this.openSnackBar(error);
          }
        );
    }
  }

  validateEmail = (control: AbstractControl) => this.emailRegex.test(control.value) ? null : { invalidEmail: true };

  validatePassword = (control: AbstractControl) => this.passwordRegx.test(control.value) ? null : { invalidPassword: true };

  ngOnDestroy(): void {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }

  openSnackBar = (message: string) => this.matSnckBar.open(message, 'X', { duration: 3000 });

  generatePassword = () => {
    const pass = this.passService.generatePass(15);
    this.password.setValue(pass);
    this.copyCodeToClipboard(pass);
  }

  checkPassStrength = (pass: string) => {
    const score = this.passService.passStrength(pass) - 50;
    if (score === 50) {
      this.passwordStrength = 'Very Strong';
    } else if (score >= 40) {
      this.passwordStrength = 'Strong';
    } else if (score >= 30) {
      this.passwordStrength = 'Average';
    } else if (score >= 20) {
      this.passwordStrength = 'Below Average';
    } else if (score >= 10) {
      this.passwordStrength = 'Weak';
    } else {
      this.passwordStrength = 'Very Weak';
    }
    this.passwordRGB = `rgb(${Math.ceil((50 - score) * 255 / 50)}, ${Math.ceil(score * 163 / 50) + 28}, ${Math.ceil(score * 137 / 50) + 28})`;
  }

  copyCodeToClipboard = (value: string) => {
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.right = '-99999px';
    document.body.appendChild(textarea);
    const selected = document.getSelection()?.rangeCount ? document.getSelection()?.getRangeAt(0) : null;
    textarea.select();
    document.execCommand('copy');
    this.matSnckBar.open('Password Inserted & Copied!', 'X', { duration: 3000 });
    document.body.removeChild(textarea);
    if (selected) {
      document.getSelection()?.removeAllRanges();
      document.getSelection()?.addRange(selected);
    }
  }

}
