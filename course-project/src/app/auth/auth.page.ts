import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
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
  isLogin = true;

  constructor(private authService: AuthService, private router: Router, private loadingCtrl: LoadingController) { }

  ngOnInit() {
  }

  onLogin(){
    // this.authService.login();
    // this.loadingCtrl.create({
    //   message: 'Please wait...',
    //   duration: 1000,
    //   keyboardClose: true,
    // }).then(loadingEl => {
    //   loadingEl.present();
    //   return loadingEl.onDidDismiss();
    // }).then(() =>{
    //   this.router.navigateByUrl('/places/tabs/discover');
    // })
  }

  onSubmit(form: NgForm){
    if(!form.valid) return;
    const email = form.value.email;
    const password = form.value.password;
    if(this.isLogin){
      //login
    }else{
      //signup
    }

  }

  onSwitchAuthMode(){
    this.isLogin = !this.isLogin;
  }
}
