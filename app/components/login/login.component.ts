import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ NgIf, RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  message: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
      console.log('Attempting to log in with:', credentials);
      this.authService.login(credentials).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.message = 'Login successful!';
          this.authService.saveToken(response.token); // Salvează token-ul
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.log('Login failed:', err);
          this.message =
            'Login failed: ' + (err.error.message || 'Unknown error'); // Afișează mesajul de eroare
        },
      });
    } else {
      this.message = 'Please fill in all required fields.'; // Mesaj pentru utilizator dacă formularul nu este valid
    }
  }
}
