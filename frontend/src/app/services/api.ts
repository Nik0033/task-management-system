import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  // Login
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { email, password });
  }

  // Get all tasks
  getTasks(status?: string): Observable<any> {
    let url = `${this.baseUrl}/tasks`;
    if (status && status !== 'All') {
      url += `?status=${status}`;
    }
    return this.http.get(url);
  }

  // Create task
  createTask(task: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/tasks`, task);
  }

  // Update task
  updateTask(id: number, task: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/tasks/${id}`, task);
  }

  // Delete task
  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/tasks/${id}`);
  }
}