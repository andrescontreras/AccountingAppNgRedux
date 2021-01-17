import { createAction, props } from '@ngrx/store';
import { IncomeExpense } from '../models/income-expenses.model';
import { User } from '../models/user.model';

export const setItems = createAction(
  '[IE] Set Items',
  props<{ items: IncomeExpense[] }>()
);
export const unSetItems = createAction('[IE] UnSet Items');
