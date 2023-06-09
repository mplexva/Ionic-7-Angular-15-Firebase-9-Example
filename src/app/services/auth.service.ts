import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, UserCredential } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth: Auth = inject(Auth);

  constructor(
    private router: Router
  ) {}

  // TODO: Subscribe to Auth events, redirect to /login upon logout

  public sign_in_with_email_pass(email: string, password: string): Promise<UserCredential>  {
    return signInWithEmailAndPassword(this.auth, email, password)
  }

  public sign_up_with_email_pass(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password)
  }

  public signOut() {
    signOut(this.auth)
    this.router.navigateByUrl('/login')
  }

}
