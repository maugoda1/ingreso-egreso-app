import { AuthGuardService } from './auth-guard.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor( public authService: AuthService ) { }

  canActivate() {
    return this.authService.isAuth();
  }
}
