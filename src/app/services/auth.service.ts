import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { empty, of, Subscription } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';
import { unSetItems } from '../income-expenses/income-expenses.actions';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userSubscription: Subscription;
  private user: User;

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
            console.log('**USER**', user);
            this.user = user;
            this.store.dispatch(authActions.setUser({ user }));
          });
      } else {
        this.user = null;
        this.userSubscription ? this.userSubscription.unsubscribe() : null;
        this.store.dispatch(authActions.unSetUser());
        this.store.dispatch(unSetItems());
      }
    });
  }

  getUserDetails(userid?: string) {
    return this.firestore.collection('users').doc(userid).valueChanges();
  }

  getCurrentUser() {
    return this.user;
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
