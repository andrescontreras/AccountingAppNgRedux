import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { IncomeExpense } from 'src/app/models/income-expenses.model';
import { IncomeExpensesService } from 'src/app/services/income-expenses.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit, OnDestroy {
  incomeExpenses: IncomeExpense[];
  ieSubs: Subscription;

  constructor(
    private store: Store<AppState>,
    private ieService: IncomeExpensesService
  ) {}

  ngOnInit(): void {
    this.ieSubs = this.store
      .select('incomeExpenses')
      .subscribe(({ items }) => (this.incomeExpenses = items));
  }

  ngOnDestroy() {
    this.ieSubs.unsubscribe();
  }

  deleteItem(uid: string) {
    this.ieService
      .deleteIncomenExpense(uid)
      .then(() => {
        Swal.fire('Elemento Borrado', '', 'success');
      })
      .catch((error) => {
        Swal.fire('Error Borrando', error.message, 'error');
      });
  }
}
