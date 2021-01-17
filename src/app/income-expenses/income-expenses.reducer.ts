import { Action, createReducer, on } from '@ngrx/store';
import { IncomeExpense } from '../models/income-expenses.model';
import { User } from '../models/user.model';
import { setItems, unSetItems } from './income-expenses.actions';

export interface State {
  items: IncomeExpense[];
}

export const initialState: State = {
  items: [],
};

const _incomeExpenseReducer = createReducer(
  initialState,
  on(setItems, (state, { items }) => ({ ...state, items: [...items] })),
  on(unSetItems, (state) => ({ ...state, items: [] }))
);

export function incomeExpenseReducer(state: State | undefined, action: Action) {
  return _incomeExpenseReducer(state, action);
}
