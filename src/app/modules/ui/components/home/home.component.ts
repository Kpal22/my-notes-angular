import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(router: Router, authService: AuthService) {
    // tslint:disable-next-line: deprecation
    authService.authenticatedUser.subscribe(user => user ? router.navigate(['dashboard']) : null);
  }

}
