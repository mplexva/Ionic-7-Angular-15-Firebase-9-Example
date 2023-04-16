import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ToastController, ToastOptions } from '@ionic/angular';

// Auth Service & Typings
import { AuthService } from 'src/app/services/auth.service';
import { UserCredential, AuthError } from '@angular/fire/auth';

// Angular Form Control
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class LoginPage implements OnInit {

  private auth = inject(AuthService)

  public loginForm = new FormGroup({
    email: new FormControl('', [
        Validators.required,
        Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),
  });

  constructor(
    private toastController: ToastController,
    private router: Router
  ) { }

  ngOnInit() {
  }

  get emailError() {
    const email =  this.loginForm.get('email')
    if (email?.errors) {
      return 'Invalid Email.'
    }
    return null
  }

  get passwordError() {
    const password =  this.loginForm.get('password')
    if (password?.errors) {
      return 'Invalid Password. Must be 6 characters.'
    }
    return null
  }

  // Auth Error Codes: https://firebase.google.com/docs/reference/js/auth#autherrorcodes

  public async loginEmail() {

    const email = this.loginForm.value.email
    const password = this.loginForm.value.password

    if (email && password) {
      this.auth.sign_in_with_email_pass(email, password)
      .then((userCredential: UserCredential) => {
        // Signed in 
        const user = userCredential.user;
        if (user) this.router.navigateByUrl('/tabs')
      })
      .catch((error: AuthError) => {
        if (error.code == 'auth/user-not-found') {
          this.loginForm.reset()
          this.presentToast('bottom', 'User Not Found', 'danger')
        } else if (error.code == 'auth/wrong-password') {
          this.loginForm.get('password')?.reset()
          this.presentToast('bottom', 'Incorrect Password', 'warning')
        } else {
          console.error('Firebase Auth Error', error.message)
          this.presentToast('bottom', 'Unknown Login Error')
        }
      });
    }
  
  }

  public async signupEmail() {

    const email = this.loginForm.value.email
    const password = this.loginForm.value.password

    if (email && password) {
      this.auth.sign_up_with_email_pass(email, password)
      .then((userCredential: UserCredential) => {
        // Success
        const user = userCredential.user;
        console.log(user)
      })
      .catch((error: AuthError) => {
        if (error.code == 'auth/email-already-in-use') {
          this.loginForm.get('password')?.reset()
          this.presentToast('bottom', 'Email Already Exists', 'warning')
        } else {
          console.error('Firebase Auth Error', error.message)
          this.presentToast('middle', 'Unknown Sign Up Error')
        }
      });
    }
  
  }

  private async presentToast(position: 'top' | 'middle' | 'bottom', message: string, color?: 'primary' | 'success' | 'warning' | 'danger'): Promise<void> {
    const toastOptions: ToastOptions = {
      message,
      duration: 2000,
      position,
      color
    }
    const toast = await this.toastController.create(toastOptions);
    await toast.present();
  }

}
