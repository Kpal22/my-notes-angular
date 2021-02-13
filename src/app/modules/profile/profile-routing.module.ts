import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileComponent } from './components/user-profile.component';
import { AuthGuardService } from './services/guard/auth-guard.service';

const routes: Routes = [
    {
        path: '', component: UserProfileComponent, canActivate: [AuthGuardService]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProfileRoutingModule { }
