import { NgModule } from '@angular/core';
import { environment } from 'src/environments/environment';

// @angular/fire Imports
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getAuth, provideAuth, connectAuthEmulator } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore'

// Angular Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';


@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ],
  providers: [
    CommonModule
  ]
})

export class AppModule { }