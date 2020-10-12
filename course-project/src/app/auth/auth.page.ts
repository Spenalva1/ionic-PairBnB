import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading = false;

  constructor(private authService: AuthService, private router: Router, private loadingCtrl: LoadingController) { }

  ngOnInit() {
  }

  onLogin(){
    this.authService.login();
    this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 1000,
      keyboardClose: true,
    }).then(loadingEl => {
      loadingEl.present();
      return loadingEl.onDidDismiss();
    }).then(() =>{
      this.router.navigateByUrl('/places/tabs/discover');
    })
  }
}
