import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule
    ],
    templateUrl: './register.html',
    styleUrl: './register.css'
})
export class RegisterComponent {
    name: string = '';
    email: string = '';
    password: string = '';
    confirmPassword: string = '';
    errorMessage: string = '';

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    onRegister() {
        this.errorMessage = '';

        if (!this.name || !this.email || !this.password) {
            this.errorMessage = 'Please fill in all fields';
            return;
        }

        if (this.password !== this.confirmPassword) {
            this.errorMessage = 'Passwords do not match';
            return;
        }

        const user = {
            name: this.name,
            email: this.email,
            password: this.password
        };

        this.authService.register(user).subscribe({
            next: (response: { success: boolean }) => {
                if (response.success) {
                    // Auto logged in
                    this.router.navigate(['/dashboard']);
                }
            },
            error: (error: any) => {
                this.errorMessage = error.error?.message || 'Registration failed';
                console.error('Registration error:', error);
            }
        });
    }

    goToLogin() {
        this.router.navigate(['/login']);
    }
}
