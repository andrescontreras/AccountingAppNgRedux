import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { empty, of, Subscription } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userSubscription: Subscription;

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private store: Store<AppState>
  ) {}

  initAuthListener() {
    this.auth.authState.subscribe((user) => {
      if (user) {
        this.userSubscription = this.getUserDetails(user.uid)
          .pipe(
            // first(),
            map(({ uid, name, email }) => new User(uid, name, email))
          )
          .subscribe((user) => {
            this.store.dispatch(authActions.setUser({ user }));
          });
      } else {
        this.userSubscription ? this.userSubscription.unsubscribe() : null;
        this.store.dispatch(authActions.unSetUser());
      }
    });
  }

  getUserDetails(userid?: string) {
    return this.firestore.collection('users').doc(userid).valueChanges();
  }

  createUser(name: string, email: string, password: string) {
    return this.auth
      .createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {
        const newUser = new User(user.uid, name, email);
        return this.firestore.doc(`users/${user.uid}`).set({ ...newUser });
      });
  }

  login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.auth.signOut();
  }

  isAuthenticated() {
    return this.auth.authState.pipe(map((fuser) => fuser !== null));
  }
}
