import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { UserData } from '../../../models/userData';
import { AuthService } from '../../../services/auth/auth.service';
import { PasswordService } from '../../../services/password/password.service';
import { DeleteProfileDialogComponent } from './delete-profile-dialog/delete-profile-dialog.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
// tslint:disable: deprecation
// tslint:disable: variable-name
// tslint:disable: max-line-length
export class UserProfileComponent implements OnInit, OnDestroy {

  updateForm!: FormGroup;
  name!: FormControl;
  email!: FormControl;
  emailRegex: RegExp;
  updatePassForm!: FormGroup;
  oldPassword!: FormControl;
  newPassword!: FormControl;
  passwordRegx: RegExp;
  passwordRGB: string;
  passwordStrength: string;
  hideOldPasswordInput: boolean;
  hideNewPasswordInput: boolean;
  authSub!: Subscription;
  updating: boolean;
  updatingPass: boolean;
  user: UserData | undefined;

  constructor(
    private authService: AuthService,
    private passService: PasswordService,
    private matSnckBar: MatSnackBar,
    private matDialog: MatDialog,
  ) {
    this.emailRegex = /\S+@\S+\.\S+/;
    this.passwordRegx = /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%^&*\-_]).{8,}$/;
    this.passwordRGB = 'rgb(255, 0, 0)';
    this.passwordStrength = 'Very Weak';
    this.hideOldPasswordInput = true;
    this.hideNewPasswordInput = true;
    this.updating = false;
    this.updatingPass = false;
    this.authSub = this.authService.authenticatedUser.subscribe(user => this.user = user);
  }

  ngOnInit(): void {
    this.name = new FormControl(this.user?.name, [Validators.required, Validators.minLength(3)]);
    this.email = new FormControl(this.user?.email, [Validators.required, this.validateEmail]);
    this.updateForm = new FormGroup({ name: this.name, email: this.email });

    this.oldPassword = new FormControl('', [Validators.required, Validators.minLength(8)]);
    this.newPassword = new FormControl('', [Validators.required, Validators.minLength(8), this.validateSamePassword]);
    this.newPassword.valueChanges.subscribe(value => this.checkPassStrength(value));
    this.updatePassForm = new FormGroup({ oldPassword: this.oldPassword, newPassword: this.newPassword });
  }

  validateEmail = (control: AbstractControl) => this.emailRegex.test(control.value) ? null : { invalidEmail: true };

  validatePassword = (control: AbstractControl) => this.passwordRegx.test(control.value) ? null : { invalidPassword: true };

  validateSamePassword = (control: AbstractControl) => control.value === this.oldPassword.value ? { samePassword: true } : null;

  ngOnDestroy(): void {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }

  private openSnackBar = (message: string) => this.matSnckBar.open(message, 'X', { duration: 3000 });

  generatePassword = () => {
    const pass = this.passService.generatePass(15);
    this.newPassword.setValue(pass);
    this.copyCodeToClipboard(pass);
  }

  private checkPassStrength = (pass: string) => {
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

  onUpdate = () => {
    if (this.updateForm.valid) {
      if (this.name.value === this.user?.name && this.email.value === this.user?.email) {
        this.openSnackBar('Nothing to update!');
      } else {
        this.updateForm.disable();
        this.updating = true;
        this.authSub = this.authService.update({ name: this.name.value, email: this.email.value })
          .subscribe(
            _data => {
              this.openSnackBar('Update Successful!');
              this.updating = false;
              this.updateForm.enable();
            },
            error => {
              this.openSnackBar(error);
              this.updating = false;
              this.updateForm.enable();
            }
          );
      }
    }
  }

  onUpdatePassword = () => {
    if (this.updatePassForm.valid) {
      this.updatePassForm.disable();
      this.updatingPass = true;
      this.authSub = this.authService.updatePass({ oldPassword: this.oldPassword.value, newPassword: this.newPassword.value })
        .subscribe(
          _data => {
            this.openSnackBar('Password Update Successful!');
            this.updatingPass = false;
            this.updatePassForm.enable();
            this.authService.logout('password');
          },
          error => {
            this.openSnackBar(error);
            this.updatingPass = false;
            this.updatePassForm.enable();
          }
        );
    }
  }

  deleteProfile = () => this.matDialog.open(DeleteProfileDialogComponent).afterClosed().subscribe(result => result ? this.authService.delete() : null);

}
