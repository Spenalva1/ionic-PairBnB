import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, take, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  constructor(private authSercive: AuthService, private router: Router){}

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authSercive.userIsAuthenticated.pipe(
      take(1),
      switchMap(isAuthenticated => {
        if (!isAuthenticated){
          return this.authSercive.autoLogin();
        }
        return of(isAuthenticated);
      }),
      tap(isAuthenticated => {
        if (!isAuthenticated){
          this.router.navigateByUrl('/auth');
        }
      })
    );
  }
}
