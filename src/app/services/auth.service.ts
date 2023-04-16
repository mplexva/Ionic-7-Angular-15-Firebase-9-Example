import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, UserCredential } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth: Auth = inject(Auth);

  constructor() { }

  public sign_in_with_email_pass(email: string, password: string): Promise<UserCredential>  {
    return signInWithEmailAndPassword(this.auth, email, password)
  }

  public sign_up_with_email_pass(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password)
  }

}
