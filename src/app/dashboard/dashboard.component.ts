import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import { setItems } from '../income-expenses/income-expenses.actions';
import { IncomeExpense } from '../models/income-expenses.model';
import { IncomeExpensesService } from '../services/income-expenses.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  userSubs: Subscription;
  ieSubs: Subscription;
  constructor(
    private store: Store<AppState>,
    private ie: IncomeExpensesService
  ) {}

  ngOnInit(): void {
    this.userSubs = this.store
      .select('auth')
      .pipe(filter((auth) => auth.user != null))
      .subscribe((auth) => {
        console.log(auth);
        this.ieSubs = this.ie
          .getIncomeExpenses(auth.user.uid)
          .subscribe((items) => {
            this.store.dispatch(setItems({ items: [...items] }));
          });
      });
  }

  ngOnDestroy() {
    this.userSubs.unsubscribe();
    this.ieSubs.unsubscribe();
  }
}
