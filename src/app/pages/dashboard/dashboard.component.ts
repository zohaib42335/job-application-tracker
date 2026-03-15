import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { JobService } from '../../services/job.service';
import { Job, JobStatus } from '../../models/job.model';

type SortKey = 'appliedDate' | 'companyName' | 'status';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent  {
   private jobService = inject(JobService);

  readonly stats = this.jobService.stats;

  filterStatus = signal<JobStatus | 'All'>('All');
  sortKey = signal<SortKey>('appliedDate');
  searchQuery = signal('');

  readonly filtered = computed(() => {
    let list = this.jobService.jobs();
    const q = this.searchQuery().toLowerCase();
    const f = this.filterStatus();

    if (q) {
      list = list.filter(
        j =>
          j.companyName.toLowerCase().includes(q) ||
          j.jobTitle.toLowerCase().includes(q)
      );
    }
    if (f !== 'All') list = list.filter(j => j.status === f);

    const key = this.sortKey();
    return [...list].sort((a, b) => {
      if (key === 'appliedDate') return b.appliedDate.localeCompare(a.appliedDate);
      if (key === 'companyName') return a.companyName.localeCompare(b.companyName);
      return a.status.localeCompare(b.status);
    });
  });

  readonly statuses: (JobStatus | 'All')[] = ['All', 'Applied', 'Interviewing', 'Offer', 'Rejected'];

  setFilter(s: JobStatus | 'All') { this.filterStatus.set(s); }
  setSort(e: Event) { this.sortKey.set((e.target as HTMLSelectElement).value as SortKey); }
  onSearch(e: Event) { this.searchQuery.set((e.target as HTMLInputElement).value); }

  statusClass(status: JobStatus): string {
    const map: Record<JobStatus, string> = {
      Applied:      'badge-applied',
      Interviewing: 'badge-interviewing',
      Offer:        'badge-offer',
      Rejected:     'badge-rejected',
    };
    return map[status];
  }
}