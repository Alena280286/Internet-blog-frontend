import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute, Router} from "@angular/router";
import {UserInfoType} from "../../../../types/user-info.type";
import {UserService} from "../../services/user-service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {ViewportScroller} from "@angular/common";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLogged: boolean = false;
  id: UserInfoType | null = null;
  name: UserInfoType | null = null;
  email: UserInfoType | null = null;

  constructor(private authService: AuthService,
              private _snackBar: MatSnackBar,
              private router: Router,
              private userService: UserService) {

    this.isLogged = this.authService.getIsLoggedIn();
    if (this.authService.getIsLoggedIn()) {
      this.userInfo();
    }
  }

  ngOnInit(): void {
    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
      if (this.authService.getIsLoggedIn()) {
        this.userInfo();
      }
    });

  }


  userInfo() {
    if (this.authService.getIsLoggedIn()) {
      this.userService.getUserInfo()
        .subscribe((data: UserInfoType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
          } else {
            this.name = (data as UserInfoType).name ? data as UserInfoType : null;
          }
        });
    }
  }


  logout(): void {
    this.authService.logout()
      .subscribe({
        next: () => {
          this.doLogout()
        },
        error: () => {
          this.doLogout();
        }
      });
  }

  doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this._snackBar.open('Вы вышли из системы');
    this.router.navigate(['/']);
  }

  scrollInto(element: string): void {
    setTimeout(() => {
      document.getElementById(element)
        ?.scrollIntoView({behavior: 'smooth'});
    }, 1);
  }
}
