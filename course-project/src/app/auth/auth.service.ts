import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from './user.model';
import { Plugins } from '@capacitor/core';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  // tslint:disable: variable-name
  private _user = new BehaviorSubject<User>(null);
  private activeLogoutTimer: any;

  get userIsAuthenticated(){
    return this._user.asObservable().pipe(
      map(user => {
        if (user){
          return !!user.token;
        }
        return false;
      })
    );
  }

  get userId(){
    return this._user.asObservable().pipe(
      map(user => {
        if (user){
          return user.id;
        }
        return null;
      })
    );
  }

  get token(){
    return this._user.asObservable().pipe(
      map(user => {
        if (user){
          return user.token;
        }
        return null;
      })
    );
  }

  constructor(private http: HttpClient) { }

  ngOnDestroy() {
    if (this.activeLogoutTimer){
      clearTimeout(this.activeLogoutTimer);
    }
  }

  autoLogin() {
    return from(Plugins.Storage.get({key: 'authData'})).pipe(
      map(userData => {
        if (!userData || !userData.value){
          return null;
        }
        const parsedData = JSON.parse(userData.value) as {
          userId: string;
          token: string;
          tokenExpirationDate: string;
          email: string;
        };
        const expirationDate = new Date(parsedData.tokenExpirationDate);
        if (expirationDate <= new Date()){
          return null;
        }
        const user = new User(parsedData.userId, parsedData.email, parsedData.token, new Date(parsedData.tokenExpirationDate));
        return user;
      }),
      tap(user => {
        this._user.next(user);
        this.autoLogout(user.tokenDuration);
      }),
      map(user => {
        return !!user;
      })
    );

  }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
      {
        email,
        password,
        returnSecureToken: true
      }
    ).pipe(tap(this.setUserData.bind(this)));
  }

  login(email: string, password: string){
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
      {
        email,
        password,
        returnSecureToken: true
      }
    ).pipe(tap(this.setUserData.bind(this)));
  }

  logout(){
    if (this.activeLogoutTimer){
      clearTimeout(this.activeLogoutTimer);
    }
    this._user.next(null);
    Plugins.Storage.remove({ key: 'authData' });
  }

  autoLogout(duration: number){
    if (this.activeLogoutTimer){
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  private setUserData(userData: AuthResponseData){
    const expirationTime = new Date((new Date()).getTime() + (+userData.expiresIn * 1000));
    const user = new User(userData.localId, userData.email, userData.idToken, expirationTime);
    this._user.next(user);
    this.autoLogout(user.tokenDuration);
    this.storeAuthData(userData.localId, userData.idToken, expirationTime.toString(), userData.email);
  }

  private storeAuthData(userId: string, token: string, tokenExpirationDate: string, email: string){
    const data = { userId, token, tokenExpirationDate, email };
    Plugins.Storage.set({
      key: 'authData',
      value: JSON.stringify(data)
    });
  }
}
