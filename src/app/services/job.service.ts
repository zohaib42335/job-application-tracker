import { Injectable, signal, computed, effect } from '@angular/core';
import { Job, JobStatus } from '../models/job.model';

const STORAGE_KEY = 'job_tracker_applications';

@Injectable({ providedIn: 'root' })
export class JobService {
  private _jobs = signal<Job[]>(this.loadFromStorage());

  readonly jobs = this._jobs.asReadonly();

  readonly stats = computed(() => {
    const list = this._jobs();
    return {
      total:        list.length,
      applied:      list.filter(j => j.status === 'Applied').length,
      interviewing: list.filter(j => j.status === 'Interviewing').length,
      offer:        list.filter(j => j.status === 'Offer').length,
      rejected:     list.filter(j => j.status === 'Rejected').length,
    };
  });

  constructor() {
    // Persist every time the signal changes
    effect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._jobs()));
    });
  }

  // ── CRUD ──────────────────────────────────────────────────────────────────
  addJob(data: Omit<Job, 'id' | 'createdAt'>): Job {
    const job: Job = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    this._jobs.update(list => [job, ...list]);
    return job;
  }

  updateJob(id: string, data: Partial<Omit<Job, 'id' | 'createdAt'>>): void {
    this._jobs.update(list =>
      list.map(j => (j.id === id ? { ...j, ...data } : j))
    );
  }

  deleteJob(id: string): void {
    this._jobs.update(list => list.filter(j => j.id !== id));
  }

  getJob(id: string): Job | undefined {
    return this._jobs().find(j => j.id === id);
  }

  private loadFromStorage(): Job[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Job[]) : [];
    } catch {
      return [];
    }
  }
}