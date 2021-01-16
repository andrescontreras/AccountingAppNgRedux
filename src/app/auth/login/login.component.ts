import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';
import * as ui from 'src/app/shared/ui.actions';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loading: boolean;

  uiSubs: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
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

  login() {
    if (this.loginForm.invalid) {
      return;
    }

    this.store.dispatch(ui.startLoading());

    // Swal.fire({
    //   title: 'Espere por favor',
    //   onBeforeOpen: () => {
    //     Swal.showLoading();
    //   },
    // });

    const { email, password } = this.loginForm.value;
    this.authService
      .login(email, password)
      .then((credentials) => {
        console.log(credentials);
        this.store.dispatch(ui.stopLoading());
        this.router.navigate(['/']);
        // Swal.close();
      })
      .catch((error) => {
        console.log(error);
        this.store.dispatch(ui.stopLoading());
        Swal.fire('Error en el login', error.message, 'error');
      });
  }
}
