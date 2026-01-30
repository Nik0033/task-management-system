import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private baseUrl = environment.apiUrl;
    private tokenKey = 'auth_token';
    private userKey = 'auth_user';

    constructor(private http: HttpClient) { }

    login(email: string, password: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/login`, { email, password }).pipe(
            tap((res: any) => {
                if (res.token) {
                    localStorage.setItem(this.tokenKey, res.token);
                    localStorage.setItem(this.userKey, JSON.stringify(res.user));
                }
            })
        );
    }

    register(user: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/register`, user).pipe(
            tap((res: any) => {
                if (res.token) {
                    localStorage.setItem(this.tokenKey, res.token);
                    localStorage.setItem(this.userKey, JSON.stringify(res.user));
                }
            })
        );
    }

    logout() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    getUser(): any {
        const user = localStorage.getItem(this.userKey);
        return user ? JSON.parse(user) : null;
    }
}
