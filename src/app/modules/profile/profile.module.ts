import { NgModule } from '@angular/core';

import { MaterialModule } from '../../material/material.module';
import { CommonNgModule } from '../../common-ng.module';

import { UserProfileComponent } from './components/user-profile.component';
import { DeleteProfileDialogComponent } from './components/delete-profile-dialog/delete-profile-dialog.component';

import { ProfileRoutingModule } from './profile-routing.module';
import { AuthGuardService } from './services/guard/auth-guard.service';

const components = [
  UserProfileComponent,
  DeleteProfileDialogComponent
];

@NgModule({
  declarations: [...components],
  imports: [
    CommonNgModule,
    MaterialModule,
    ProfileRoutingModule
  ],
  providers: [AuthGuardService],
  exports: [...components]
})
export class ProfileModule { }
