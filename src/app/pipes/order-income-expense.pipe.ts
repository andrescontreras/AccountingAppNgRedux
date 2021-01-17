import { Pipe, PipeTransform } from '@angular/core';
import { IncomeExpense } from '../models/income-expenses.model';

@Pipe({
  name: 'orderIncomeExpense',
})
export class OrderIncomeExpensePipe implements PipeTransform {
  transform(items: IncomeExpense[]): IncomeExpense[] {
    return items.slice().sort((a, b) => {
      if (a.type === 'Income') {
        return -1;
      } else {
        return 1;
      }
    });
  }
}
