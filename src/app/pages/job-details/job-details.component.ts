import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { JobService } from '../../services/job.service';
import { Job, JobStatus } from '../../models/job.model';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [RouterLink, DatePipe, ReactiveFormsModule],
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.css'],
})
export class JobDetailsComponent implements OnInit {
  private route      = inject(ActivatedRoute);
  private router     = inject(Router);
  private jobService = inject(JobService);
  private fb         = inject(FormBuilder);

  readonly statuses: JobStatus[] = ['Applied', 'Interviewing', 'Offer', 'Rejected'];

  jobId = '';
  job = signal<Job | null>(null);
  editMode = signal(false);
  showDeleteModal = signal(false);
  submitted = false;

  form!: FormGroup;

  readonly statusClass = computed(() => {
    const map: Record<JobStatus, string> = {
      Applied:      'badge-applied',
      Interviewing: 'badge-interviewing',
      Offer:        'badge-offer',
      Rejected:     'badge-rejected',
    };
    return map[this.job()?.status ?? 'Applied'];
  });

  ngOnInit(): void {
    this.jobId = this.route.snapshot.paramMap.get('id') ?? '';
    const found = this.jobService.getJob(this.jobId);
    if (!found) { this.router.navigate(['/']); return; }
    this.job.set(found);
    this.initForm(found);
  }

  private initForm(job: Job) {
    this.form = this.fb.group({
      companyName: [job.companyName, [Validators.required, Validators.minLength(2)]],
      jobTitle:    [job.jobTitle,    [Validators.required, Validators.minLength(2)]],
      status:      [job.status,      Validators.required],
      appliedDate: [job.appliedDate, Validators.required],
      notes:       [job.notes],
    });
  }

  startEdit()  { this.editMode.set(true); }
  cancelEdit() { this.editMode.set(false); this.submitted = false; const j = this.job(); if (j) this.initForm(j); }

  get f() { return this.form.controls; }
  isInvalid(field: string) {
    const ctrl = this.form.get(field);
    return !!ctrl && ctrl.invalid && (ctrl.touched || this.submitted);
  }

  saveEdit() {
    this.submitted = true;
    if (this.form.invalid) return;
    this.jobService.updateJob(this.jobId, this.form.getRawValue());
    this.job.set(this.jobService.getJob(this.jobId) ?? null);
    this.editMode.set(false);
    this.submitted = false;
  }

  confirmDelete() { this.showDeleteModal.set(true); }
  cancelDelete()  { this.showDeleteModal.set(false); }
  deleteJob() {
    this.jobService.deleteJob(this.jobId);
    this.router.navigate(['/']);
  }
}