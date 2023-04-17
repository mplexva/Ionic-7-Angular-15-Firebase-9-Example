import { NgModule } from '@angular/core';
import { environment } from 'src/environments/environment';

// @angular/fire Imports
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getAuth, provideAuth, connectAuthEmulator } from '@angular/fire/auth';
import { connectFirestoreEmulator, getFirestore, provideFirestore } from '@angular/fire/firestore'

// Angular Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';


@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => {
      const auth = getAuth()
      if (environment.use_emulators) connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true})
      return auth
    }),
    provideFirestore(() => {
      const firestore = getFirestore()
      if (environment.use_emulators) connectFirestoreEmulator(firestore, 'localhost', 8080)
      return firestore
    })
  ],
  providers: [
    CommonModule
  ]
})

export class AppModule { }