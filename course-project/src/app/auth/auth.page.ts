import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService, AuthResponseData } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading = false;
  isLogin = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
  }

  async authenticate(email: string, password: string){
    const loadingEl = await this.loadingCtrl.create({
      message: 'Please waits...',
      keyboardClose: true,
    });
    loadingEl.present();
    let authObs: Observable<AuthResponseData>;
    if (this.isLogin) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }
    authObs.subscribe(resData => {
      loadingEl.dismiss();
      this.router.navigateByUrl('/places/tabs/discover');
    }, errRes => {
      loadingEl.dismiss();
      const code = errRes.error.error.message;
      let message = 'Authentication error, please try again.';
      switch (code) {
        case 'EMAIL_EXISTS':
          message = 'This email has already been taken.';
          break;
        case 'EMAIL_NOT_FOUND':
          message = 'Email has not been found.';
          break;
        case 'INVALID_PASSWORD':
          message = 'Incorrect password.';
          break;
      }
      this.showErrorAlert(message);
    });
  }

  async showErrorAlert(message: string){
    const alertEl = await this.alertCtrl.create({
      header: 'Authentication failed',
      message,
      buttons: ['Okay']
    });
    alertEl.present();
  }

  async onSubmit(form: NgForm){
    if (!form.valid){
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    this.authenticate(email, password);
  }

  onSwitchAuthMode(){
    this.isLogin = !this.isLogin;
  }
}
