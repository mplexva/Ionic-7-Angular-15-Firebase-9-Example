import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Firestore, addDoc, CollectionReference, collection, collectionData, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { BrowserModule } from '@angular/platform-browser';

interface UserProfile {
  username: string
  displayName: string
}

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class UsersPage implements OnInit {

  private firestore: Firestore = inject(Firestore);

  users$: Observable<UserProfile[]>;
  usersCollection: CollectionReference;

  constructor() {
    // get a reference to the user-profile collection
    this.usersCollection = collection(this.firestore, 'users');

    // get documents (data) from the collection using collectionData
    this.users$ = collectionData(this.usersCollection) as Observable<UserProfile[]>;
  }

  ngOnInit() {
    
  }

  addUserProfile(username: string) {
    if (!username) return;
    const userProfile: UserProfile = {
      username: 'bob',
      displayName: 'Bob Sagget'
    }
    addDoc(this.usersCollection, userProfile).then((documentReference: DocumentReference) => {
        // the documentReference provides access to the newly created document
    });
  }

}
