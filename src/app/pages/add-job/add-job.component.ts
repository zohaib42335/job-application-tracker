import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { JobService } from '../../services/job.service';
import { JobStatus } from '../../models/job.model';

@Component({
  selector: 'app-add-job',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './add-job.component.html',
  styleUrl: './add-job.component.css',
})
export class AddJobComponent {
  private fb = inject(FormBuilder);
  private jobService = inject(JobService);
  private router = inject(Router);

  readonly statuses: JobStatus[] = ['Applied', 'Interviewing', 'Offer', 'Rejected'];

  form: FormGroup = this.fb.group({
    companyName: ['', [Validators.required, Validators.minLength(2)]],
    jobTitle:    ['', [Validators.required, Validators.minLength(2)]],
    status:      ['Applied' as JobStatus, Validators.required],
    appliedDate: [new Date().toISOString().split('T')[0], Validators.required],
    notes:       [''],
  });

  submitted = false;

  get f() { return this.form.controls; }

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!ctrl && ctrl.invalid && (ctrl.touched || this.submitted);
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) return;
    const job = this.jobService.addJob(this.form.getRawValue());
    this.router.navigate(['/job', job.id]);
  }
}