import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

export interface TaskData {
  id?: number;
  title: string;
  description: string;
  status: string;
  due_date: string;
  isEditMode: boolean;
}

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  template: `
    <div class="dialog-header">
      <mat-icon class="header-icon">{{ data.isEditMode ? 'edit' : 'add_task' }}</mat-icon>
      <h2 mat-dialog-title>{{ data.isEditMode ? 'Edit Task' : 'New Task' }}</h2>
    </div>
    
    <mat-dialog-content>
      <p class="dialog-subtitle">Fill in the details below to manage your workflow.</p>
      <div class="form-container">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Title</mat-label>
          <input matInput [(ngModel)]="data.title" required placeholder="Ex. Design Mockups">
          <mat-icon matSuffix>title</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput [(ngModel)]="data.description" rows="3" placeholder="Add details..."></textarea>
        </mat-form-field>

        <div class="row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Status</mat-label>
            <mat-select [(ngModel)]="data.status">
              <mat-option value="Pending">
                <mat-icon class="status-icon pending">schedule</mat-icon> Pending
              </mat-option>
              <mat-option value="In Progress">
                <mat-icon class="status-icon progress">trending_up</mat-icon> In Progress
              </mat-option>
              <mat-option value="Completed">
                <mat-icon class="status-icon completed">check_circle</mat-icon> Completed
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Due Date</mat-label>
            <input matInput [matDatepicker]="picker" [(ngModel)]="data.due_date">
            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>
        </div>
      </div>
    </mat-dialog-content>
    
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()" class="cancel-btn">Cancel</button>
      <button mat-raised-button class="save-btn" (click)="onSave()" cdkFocusInitial>
        {{ data.isEditMode ? 'Update' : 'Create' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    /* Header */
    .dialog-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 24px 24px 0 24px;
      margin-bottom: 8px;
    }
    
    .header-icon {
      color: #00d2ff;
      transform: scale(1.2);
    }

    h2[mat-dialog-title] {
      margin: 0;
      font-size: 1.8rem;
      font-weight: 300;
      background: linear-gradient(90deg, #fff, #b0bec5);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: 1px;
    }

    .dialog-subtitle {
      color: rgba(255, 255, 255, 0.5);
      margin: 0 0 20px 0;
      font-size: 0.9rem;
    }

    /* Content */
    .form-container {
      display: flex;
      flex-direction: column;
      min-width: 450px;
      gap: 16px;
      padding-top: 10px;
    }

    .row {
      display: flex;
      gap: 16px;
    }

    .full-width { width: 100%; }
    .half-width { flex: 1; }

    /* Icons in Select */
    .status-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      margin-right: 8px;
      vertical-align: middle;
    }
    .status-icon.pending { color: #cfd8dc; }
    .status-icon.progress { color: #ffab00; }
    .status-icon.completed { color: #00e676; }

    /* Buttons */
    .mat-mdc-dialog-actions {
      padding: 16px 24px 24px 24px;
      border-top: 1px solid rgba(255,255,255,0.05);
    }

    .save-btn {
      background: linear-gradient(135deg, #00c6ff, #0072ff) !important;
      color: white !important;
      border-radius: 25px;
      padding: 0 30px;
      box-shadow: 0 4px 15px rgba(0, 114, 255, 0.3);
      font-weight: 500;
      letter-spacing: 0.5px;
    }

    .cancel-btn {
      color: rgba(255,255,255,0.6);
    }
  `]
})
export class TaskDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskData
  ) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.data);
  }
}
