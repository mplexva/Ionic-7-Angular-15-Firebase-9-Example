import { inject } from "@angular/core";
import { Auth, authState } from "@angular/fire/auth";
import { Router, UrlTree } from "@angular/router";
import { map, Observable } from "rxjs";

export const authGuard = (): Observable<boolean | UrlTree> => {

  const auth = inject(Auth)
  const authState$ = authState(auth);
  const router = inject(Router)
  
  return authState$.pipe(
    map(user => {
      return user ? true : router.parseUrl('/login')
    })
  );
  
};
