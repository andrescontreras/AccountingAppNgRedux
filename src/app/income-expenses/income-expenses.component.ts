import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { AppState } from '../app.reducer';
import { IncomeExpense } from '../models/income-expenses.model';
import { IncomeExpensesService } from '../services/income-expenses.service';
import { startLoading, stopLoading } from '../shared/ui.actions';
import { uiReducer } from '../shared/ui.reducer';

@Component({
  selector: 'app-income-expenses',
  templateUrl: './income-expenses.component.html',
  styleUrls: ['./income-expenses.component.scss'],
})
export class IncomeExpensesComponent implements OnInit, OnDestroy {
  incomeForm: FormGroup;
  type: string = 'Income';
  isLoading: boolean;
  loadingSubs: Subscription;

  constructor(
    private fb: FormBuilder,
    private ieService: IncomeExpensesService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.incomeForm = this.fb.group({
      description: ['', Validators.required],
      amount: ['', Validators.required],
      // type: ['', Validators.required],
    });

    this.loadingSubs = this.store
      .select('ui')
      .subscribe(({ isLoading }) => (this.isLoading = isLoading));
  }

  ngOnDestroy() {
    this.loadingSubs.unsubscribe();
  }

  save() {
    this.store.dispatch(startLoading());
    if (this.incomeForm.invalid) {
      return;
    }

    const { description, amount, type } = this.incomeForm.value;
    const ie = new IncomeExpense(description, amount, this.type, null);
    console.log(ie);
    this.ieService
      .createIncomeExpense(ie)
      .then((data) => {
        console.log(data);
        this.store.dispatch(stopLoading());
        Swal.fire('Guardado correctamente', '', 'success');
      })
      .catch((error) => {
        console.error(error);
        this.store.dispatch(stopLoading());
        Swal.fire('Error en el login', error.message, 'error');
      });
    this.incomeForm.reset();
  }
}
