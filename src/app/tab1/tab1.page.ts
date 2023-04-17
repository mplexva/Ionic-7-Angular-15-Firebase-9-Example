import { Component, inject, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Firestore, addDoc, CollectionReference, collection, collectionData, DocumentReference, Timestamp, query, orderBy, Query, doc, deleteDoc, updateDoc, arrayUnion, arrayRemove } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { Auth, user, User } from '@angular/fire/auth';
import { limit } from '@firebase/firestore';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

interface Message {
  id?: string
  user_uid: string
  display_name: string
  text: string
  likes?: [string]
  created_at: Timestamp
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class Tab1Page implements OnDestroy {

  message_text = new FormControl('', [Validators.required, Validators.minLength(1)])

  private auth: Auth = inject(Auth);
  private user$ = user(this.auth);
  private userSubscription: Subscription;
  private authService = inject(AuthService);
  
  private firestore: Firestore = inject(Firestore);

  messages$: Observable<Message[]>;
  messagesCollection: CollectionReference;

  current_user: User | null = null

  constructor() {
    this.messagesCollection = collection(this.firestore, 'messages');
    this.messages$ = collectionData(query(this.messagesCollection, orderBy('created_at', 'desc'), limit(30)), { idField: 'id'}) as Observable<Message[]>;

    this.userSubscription = this.user$.subscribe((user: User | null) => {
      this.current_user = user
    })
  }

  ngOnInit() {
    
  }

  addMessage() {
    if (this.message_text.valid && this.message_text.value && this.current_user) {
      const message: Message = {
        user_uid: this.current_user.uid,
        display_name: this.current_user.displayName ? this.current_user.displayName : 'Anonymous User',
        text: this.message_text.value,
        created_at: Timestamp.now()
      }
      addDoc(this.messagesCollection, message).then((documentReference: DocumentReference) => {
          // the documentReference provides access to the newly created document
          // Clear input after success
          this.message_text.reset()
      });
    }
  }

  async deleteMessage(id: string | undefined) {
    if (id) await deleteDoc(doc(this.firestore, 'messages', id))
  }

  async likeMessage(id: string | undefined) {
    if (id && this.current_user?.uid) {
      await updateDoc(doc(this.firestore, 'messages', id), {
        likes: arrayUnion(this.current_user?.uid)
      })
    }
  }

  async unlikeMessage(id: string | undefined) {
    if (id && this.current_user?.uid) {
      await updateDoc(doc(this.firestore, 'messages', id), {
        likes: arrayRemove(this.current_user?.uid)
      })
    }
  }

  public hasLiked(message: Message) {
    if (this.current_user?.uid && message.likes?.length) {
      return message.likes.includes(this.current_user.uid)
    }
    return false
  }

  public logout() {
    this.authService.signOut()
  }

  ngOnDestroy() {
    // when manually subscribing to an observable remember to unsubscribe in ngOnDestroy
    this.userSubscription.unsubscribe();
  }

}
