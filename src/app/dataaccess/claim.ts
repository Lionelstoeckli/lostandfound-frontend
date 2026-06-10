import {Report} from './report';
import {User} from './user';

export type ClaimStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export const CLAIM_STATUSES: ClaimStatus[] = ['PENDING', 'APPROVED', 'REJECTED'];

export class Claim {
  public id!: number;
  public message = '';
  public status: ClaimStatus = 'PENDING';
  public createdAt: any = new Date();
  public report = new Report();
  public user = new User();
}
