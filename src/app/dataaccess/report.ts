import {Item} from './item';
import {User} from './user';

export type ReportType = 'LOST' | 'FOUND';
export type ReportStatus = 'OPEN' | 'CLOSED';

export const REPORT_TYPES: ReportType[] = ['LOST', 'FOUND'];
export const REPORT_STATUSES: ReportStatus[] = ['OPEN', 'CLOSED'];

export class Report {
  public id!: number;
  public type: ReportType = 'LOST';
  public status: ReportStatus = 'OPEN';
  public location = '';
  public reportedAt: any = new Date();
  public item = new Item();
  public user = new User();
}
