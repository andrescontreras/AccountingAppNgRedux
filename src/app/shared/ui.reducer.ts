import { Action, createReducer, on } from '@ngrx/store';
import { startLoading, stopLoading } from './ui.actions';

export interface State {
  isLoading: boolean;
}

export const initialState: State = {
  isLoading: false,
};

const _uiReducer = createReducer(
  initialState,
  on(startLoading, (state) => ({ ...state, isLoading: true })),
  on(stopLoading, (state) => ({ ...state, isLoading: false }))
);

export function uiReducer(state: State | undefined, action: Action) {
  return _uiReducer(state, action);
}
