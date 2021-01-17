import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { IncomeExpense } from '../models/income-expenses.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class IncomeExpensesService {
  constructor(private firestore: AngularFirestore, private auth: AuthService) {}

  createIncomeExpense(incomeExpense?: IncomeExpense) {
    const user = this.auth.getCurrentUser();
    return this.firestore
      .collection(`users/${user.uid}/income-expense`)
      .add({ ...incomeExpense });
  }

  getIncomeExpenses(uid: string) {
    return this.firestore
      .collection(`users/${uid}/income-expense`)
      .snapshotChanges()
      .pipe(
        map((snapshot) =>
          snapshot.map((doc) => ({
            ...(doc.payload.doc.data() as any),
            uid: doc.payload.doc.id,
          }))
        )
      );
  }

  deleteIncomenExpense(itemUid: string) {
    const user = this.auth.getCurrentUser();
    return this.firestore
      .doc(`users/${user.uid}/income-expense/${itemUid}`)
      .delete();
  }
}
