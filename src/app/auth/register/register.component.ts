import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import * as ui from 'src/app/shared/ui.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  uiSubs: Subscription;
  loading: boolean;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required, Validators.email],
      password: ['', Validators.required],
    });

    this.uiSubs = this.store
      .select('ui')
      .subscribe((ui) => (this.loading = ui.isLoading));
  }

  ngOnDestroy() {
    this.uiSubs.unsubscribe();
  }

  createUser() {
    if (this.formGroup.invalid) {
      return;
    }

    this.store.dispatch(ui.startLoading());

    // Swal.fire({
    //   title: 'Espere por favor',
    //   onBeforeOpen: () => {
    //     Swal.showLoading();
    //   },
    // });

    const { name, email, password } = this.formGroup.value;
    this.authService
      .createUser(name, email, password)
      .then((credentials) => {
        console.log(credentials);
        this.store.dispatch(ui.stopLoading());
        this.router.navigate(['/']);
      })
      .catch((error) => {
        console.log(error);
        this.store.dispatch(ui.stopLoading());
        Swal.fire('Error en el registro', error.message, 'error');
      });
  }
}
