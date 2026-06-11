import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {HeaderService} from '../../service/header.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import moment from 'moment';
import {Claim, CLAIM_STATUSES, ClaimStatus} from '../../dataaccess/claim';
import {Report} from '../../dataaccess/report';
import {User} from '../../dataaccess/user';
import {BaseComponent} from '../../components/base/base.component';
import {ClaimService} from '../../service/claim.service';
import {ReportService} from '../../service/report.service';
import {UserService} from '../../service/user.service';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel, MatSuffix, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDatepickerInput, MatDatepickerToggle, MatDatepicker } from '@angular/material/datepicker';
import { AutofocusDirective } from '../../dir/autofocus-dir';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

@Component({
    selector: 'app-claim-detail',
    templateUrl: './claim-detail.component.html',
    styleUrls: ['./claim-detail.component.scss'],
    imports: [MatToolbar, MatToolbarRow, MatButton, MatIcon, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatDatepickerInput, AutofocusDirective, MatDatepickerToggle, MatSuffix, MatDatepicker, MatHint, MatSelect, MatOption, CdkTextareaAutosize, TranslateModule]
})
export class ClaimDetailComponent extends BaseComponent implements OnInit {
  private router = inject(Router);
  private headerService = inject(HeaderService);
  private route = inject(ActivatedRoute);
  private claimService = inject(ClaimService);
  private reportService = inject(ReportService);
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);
  private fb = inject(UntypedFormBuilder);


  claim = new Claim();
  reports: Report[] = [];
  users: User[] = [];

  readonly statuses: ClaimStatus[] = CLAIM_STATUSES;

  public objForm = new UntypedFormGroup({
    message: new UntypedFormControl(''),
    status: new UntypedFormControl('PENDING'),
    createdAt: new UntypedFormControl(moment()),
    reportId: new UntypedFormControl(''),
    userId: new UntypedFormControl('')
  });

  constructor() {
    super();
  }

  ngOnInit(): void {
    if (this.route.snapshot.paramMap.get('id') !== null) {
      const id = Number.parseInt(this.route.snapshot.paramMap.get('id') as string);
      this.claimService.getOne(id).subscribe(obj => {
        this.claim = obj;
        this.headerService.setPage('nav.claim_edit');
        this.objForm = this.fb.group(obj);
        this.objForm.patchValue({createdAt: obj.createdAt ? moment(obj.createdAt) : null});
        this.objForm.addControl('reportId', new UntypedFormControl(obj.report.id));
        this.objForm.addControl('userId', new UntypedFormControl(obj.user.id));
      });
    } else {
      this.headerService.setPage('nav.claim_new');
    }

    this.reportService.getList().subscribe(obj => {
      this.reports = obj;
    });
    this.userService.getList().subscribe(obj => {
      this.users = obj;
    });
  }

  async back() {
    await this.router.navigate(['claims']);
  }

  async save(formData: any) {
    this.claim = Object.assign(new Claim(), formData);
    this.claim.createdAt = moment(formData.createdAt).format('YYYY-MM-DD');
    this.claim.report = this.reports.find(o => o.id === formData.reportId) as Report;
    this.claim.user = this.users.find(o => o.id === formData.userId) as User;

    if (this.claim.id) {
      this.claimService.update(this.claim).subscribe({
        next: () => {
          this.snackBar.open(this.messageSaved, this.messageClose, {duration: 5000});
          this.back();
        },
        error: () => {
          this.snackBar.open(this.messageError, this.messageClose, {duration: 5000, politeness: 'assertive'});
        }
      });
    } else {
      this.claimService.save(this.claim).subscribe({
        next: () => {
          this.snackBar.open(this.messageNewSaved, this.messageClose, {duration: 5000});
          this.back();
        },
        error: () => {
          this.snackBar.open(this.messageNewError, this.messageClose, {duration: 5000, politeness: 'assertive'});
        }
      });
    }
  }

}
