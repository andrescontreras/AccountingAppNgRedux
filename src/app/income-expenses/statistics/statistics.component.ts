import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ChartType } from 'chart.js';
import { Label, MultiDataSet } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { IncomeExpense } from 'src/app/models/income-expenses.model';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit, OnDestroy {
  incomes = 0;
  expenses = 0;

  totalIncomes = 0;
  totalExpenses = 0;

  public doughnutChartLabels: Label[] = ['Ingresos', 'Egresos'];
  public doughnutChartData: MultiDataSet = [[]];
  public doughnutChartType: ChartType = 'doughnut';

  subs: Subscription;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.subs = this.store
      .select('incomeExpenses')
      .subscribe(({ items }) => this.generateStatistics(items));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  generateStatistics(items: IncomeExpense[]) {
    this.totalExpenses = 0;
    this.totalIncomes = 0;
    this.incomes = 0;
    this.expenses = 0;
    for (const item of items) {
      if (item.type === 'Income') {
        this.totalIncomes += item.amount;
        this.incomes++;
      } else {
        this.totalExpenses += item.amount;
        this.expenses++;
      }
    }
    this.doughnutChartData = [[this.totalIncomes, this.totalExpenses]];
  }
}
