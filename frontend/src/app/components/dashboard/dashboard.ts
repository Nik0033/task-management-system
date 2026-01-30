import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth.service';

// Material Imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

import { TaskDialogComponent, TaskData } from './task-dialog.component';
import { fadeInAnimation, listAnimation } from '../../animations'; // Import animations

interface Task {
  id?: number;
  user_id: number;
  title: string;
  description: string;
  status: string;
  due_date: string;
  created_at?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatChipsModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    DatePipe
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  animations: [fadeInAnimation, listAnimation] // Register animations
})
export class DashboardComponent implements OnInit {
  user: any = null;
  tasks: Task[] = [];
  filterStatus: string = 'All';

  // Sidebar items
  navItems = [
    { label: 'All Tasks', icon: 'dashboard', value: 'All' },
    { label: 'Pending', icon: 'schedule', value: 'Pending' },
    { label: 'In Progress', icon: 'trending_up', value: 'In Progress' },
    { label: 'Completed', icon: 'check_circle', value: 'Completed' }
  ];

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.user = this.authService.getUser();
    this.loadTasks();
  }

  loadTasks() {
    this.apiService.getTasks(this.filterStatus).subscribe({
      next: (response: { success: boolean; tasks?: Task[] }) => {
        if (response.success) {
          this.tasks = response.tasks ?? [];
        }
      },
      error: (error: unknown) => {
        console.error('Error loading tasks:', error);
      }
    });
  }

  // Helper to change filter from Sidebar
  setFilter(status: string) {
    this.filterStatus = status;
    this.loadTasks();
  }

  // STATISTICS (Computed from current list or would require separate API if pagination existed)
  // Since our API currently filters on backend, these stats would only reflect the CURRENT VIEW if we just count `this.tasks`.
  // Ideally, we want global stats. Visual only for now, or we can fetch all for stats.
  // For this exercise, let's assume we want to show counts of what's currently visible or we'd need a separate "getStats" API.
  // Let's implement a visual trick: We'll stick to 'All' to get counts, or just show counts of visible.
  // actually, a better UX is to fetch ALL for stats, then filter locally, OR just accept that stats reflect current filter? 
  // No, stats should be global.
  // Let's stick to the prompt "Modernize UI". I'll add the getters but be aware they count visible tasks unless we change logic.
  // To make it robust: I will fetch ALL tasks initially to populate stats if possible, or just ignore exact counts if complex.
  // Actually, simplest is: Sidebar filters the Main View. Stats show summary of THAT view or Global?
  // Let's make stats show count of tasks in the current view for now, effectively "Results Found".

  get totalTasksCount(): number {
    return this.tasks.length;
  }

  get pendingFactory(): number {
    return this.tasks.filter(t => t.status === 'Pending').length;
  }

  // Basic counts suitable for the current filtered view
  get pendingCount(): number {
    return this.tasks.filter(t => t.status === 'Pending').length;
  }

  get completedCount(): number {
    return this.tasks.filter(t => t.status === 'Completed').length;
  }

  get inProgressCount(): number {
    return this.tasks.filter(t => t.status === 'In Progress').length;
  }

  onFilterChange() {
    this.loadTasks();
  }

  openTaskDialog(task?: Task) {
    const isEditMode = !!task;
    const dialogData: TaskData = {
      id: task?.id,
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status || 'Pending',
      due_date: task?.due_date || '',
      isEditMode: isEditMode
    };

    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '500px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (isEditMode) {
          this.updateTask(result);
        } else {
          this.createTask(result);
        }
      }
    });
  }

  createTask(taskData: TaskData) {
    const newTask = {
      ...taskData,
      user_id: this.user?.id || 0
    };

    this.apiService.createTask(newTask).subscribe({
      next: (response: { success: boolean }) => {
        if (response.success) {
          this.loadTasks();
        }
      },
      error: (error: unknown) => {
        console.error('Error creating task:', error);
        alert('Error creating task');
      }
    });
  }

  updateTask(taskData: TaskData) {
    const updatedTask = { ...taskData };
    this.apiService.updateTask(taskData.id!, updatedTask).subscribe({
      next: (response: { success: boolean }) => {
        if (response.success) {
          this.loadTasks();
        }
      },
      error: (error: unknown) => {
        console.error('Error updating task:', error);
        alert('Error updating task');
      }
    });
  }

  deleteTask(id: number) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.apiService.deleteTask(id).subscribe({
        next: (response: { success: boolean }) => {
          if (response.success) {
            this.loadTasks();
          }
        },
        error: (error: unknown) => {
          console.error('Error deleting task:', error);
          alert('Error deleting task');
        }
      });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Helper for chip colors
  getStatusColor(status: string): string {
    switch (status) {
      case 'Completed': return 'accent'; // or custom class
      case 'In Progress': return 'primary';
      default: return 'warn';
    }
  }
}
