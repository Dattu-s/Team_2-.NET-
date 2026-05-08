import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="row justify-content-center">
      <form class="col-md-6 card p-4 shadow-sm" [formGroup]="form" (ngSubmit)="submit()">
        <h1 class="page-title mb-3">Register</h1>
        <input class="form-control mb-3" placeholder="Name" formControlName="userName">
        <input class="form-control mb-3" placeholder="Email" formControlName="userEmail">
        <input class="form-control mb-3" placeholder="Password" type="password" formControlName="password">
        <select class="form-select mb-3" formControlName="role">
          <option value="Customer">Customer</option>
          <option value="Admin">Admin</option>
        </select>
        @if (error) { <div class="alert alert-danger py-2">{{ error }}</div> }
        <button class="btn btn-success w-100" [disabled]="form.invalid">Register</button>
        <a class="mt-3 d-inline-block" routerLink="/login">Already have an account</a>
      </form>
    </div>
  `
})
export class Register {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  error = '';
  form = this.fb.nonNullable.group({
    userName: ['', Validators.required],
    userEmail: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['Customer', Validators.required]
  });

  submit() {
    this.auth.register(this.form.getRawValue()).subscribe({
      next: () => this.router.navigateByUrl('/medicines'),
      error: (err) => this.error = err.error?.message ?? 'Registration failed'
    });
  }
}
