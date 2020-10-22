import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, take } from 'rxjs/operators';
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
      tap(isAuthenticated => {
        if (!isAuthenticated){
          this.router.navigateByUrl('/auth');
        }
      })
    );
  }
}
