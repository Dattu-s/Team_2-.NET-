import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="row justify-content-center">
      <form class="col-md-5 card p-4 shadow-sm" [formGroup]="form" (ngSubmit)="submit()">
        <h1 class="page-title mb-3">Login</h1>
        <input class="form-control mb-3" placeholder="Email" formControlName="userEmail">
        <input class="form-control mb-3" placeholder="Password" type="password" formControlName="password">
        @if (error) { <div class="alert alert-danger py-2">{{ error }}</div> }
        <button class="btn btn-success w-100" [disabled]="form.invalid">Login</button>
        <a class="mt-3 d-inline-block" routerLink="/register">Create an account</a>
      </form>
    </div>
  `
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  error = '';
  form = this.fb.nonNullable.group({ userEmail: ['', [Validators.required, Validators.email]], password: ['', Validators.required] });

  submit() {
    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => this.router.navigateByUrl('/medicines'),
      error: (err) => this.error = err.error?.message ?? 'Login failed'
    });
  }
}
