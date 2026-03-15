export type JobStatus = 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';

export interface Job {
  id: string;
  companyName: string;
  jobTitle: string;
  status: JobStatus;
  appliedDate: string; // ISO date string YYYY-MM-DD
  notes: string;
  createdAt: number;
}