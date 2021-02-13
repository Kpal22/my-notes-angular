import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../services/auth/auth.service';
import { LogoutDialogComponent } from './logout-dialog/logout-dialog.component';
import { faAdjust } from '@fortawesome/free-solid-svg-icons';
import { Event, NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
// tslint:disable: deprecation
// tslint:disable: max-line-length
export class HeaderComponent {

  theme: string;
  faAdjust = faAdjust;
  showMenu: boolean;
  showProfileMenu: boolean;
  isHome: boolean | undefined;
  isProfile: boolean | undefined;

  constructor(breakpointObserver: BreakpointObserver,
              private authService: AuthService,
              matSnackBar: MatSnackBar,
              private matDialog: MatDialog,
              router: Router) {
    this.showProfileMenu = false;
    this.showMenu = false;
    breakpointObserver.observe([Breakpoints.HandsetPortrait]).subscribe(breakPoint => this.showMenu = breakPoint.matches);
    this.theme = localStorage.getItem('theme') === 'dark-theme' ? 'dark-theme' : 'light-theme';
    this.authService.authenticatedUser.subscribe(user => this.showProfileMenu = user !== undefined);
    this.authService.userLogOut
      .subscribe(type => {
        if (type === 'password') {
          matSnackBar.open('Please login with new password!', 'X', { duration: 3000 });
        } else if (type === 'delete') {
          matSnackBar.open('Profile Deletion Successful!', 'X', { duration: 3000 });
        } else if (type === 'auto') {
          matSnackBar.open('Auto Logout!', 'X', { duration: 3000 });
        } else {
          matSnackBar.open('Logout Successful!', 'X', { duration: 3000 });
        }
      });
    router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe((event: Event) => {
        this.isHome = (event as NavigationStart).url === '/home' || (event as NavigationStart).url === '/';
        this.isProfile = (event as NavigationStart).url === '/profile';
      });
  }

  toggleTheme = () => {
    this.theme = this.theme === 'dark-theme' ? 'light-theme' : 'dark-theme';
    localStorage.setItem('theme', this.theme);
  }

  openLogoutDialog = () => this.matDialog.open(LogoutDialogComponent).afterClosed().subscribe(result => result ? this.authService.logout() : null);

}
