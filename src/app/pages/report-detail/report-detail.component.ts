import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {HeaderService} from '../../service/header.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import moment from 'moment';
import {Report, REPORT_STATUSES, REPORT_TYPES, ReportStatus, ReportType} from '../../dataaccess/report';
import {Item} from '../../dataaccess/item';
import {User} from '../../dataaccess/user';
import {BaseComponent} from '../../components/base/base.component';
import {ReportService} from '../../service/report.service';
import {ItemService} from '../../service/item.service';
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

@Component({
    selector: 'app-report-detail',
    templateUrl: './report-detail.component.html',
    styleUrls: ['./report-detail.component.scss'],
    imports: [MatToolbar, MatToolbarRow, MatButton, MatIcon, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatDatepickerInput, AutofocusDirective, MatDatepickerToggle, MatSuffix, MatDatepicker, MatHint, MatSelect, MatOption, TranslateModule]
})
export class ReportDetailComponent extends BaseComponent implements OnInit {
  private router = inject(Router);
  private headerService = inject(HeaderService);
  private route = inject(ActivatedRoute);
  private reportService = inject(ReportService);
  private itemService = inject(ItemService);
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);
  private fb = inject(UntypedFormBuilder);


  report = new Report();
  items: Item[] = [];
  users: User[] = [];

  readonly types: ReportType[] = REPORT_TYPES;
  readonly statuses: ReportStatus[] = REPORT_STATUSES;

  public objForm = new UntypedFormGroup({
    type: new UntypedFormControl('LOST'),
    status: new UntypedFormControl('OPEN'),
    location: new UntypedFormControl(''),
    reportedAt: new UntypedFormControl(moment()),
    itemId: new UntypedFormControl(''),
    userId: new UntypedFormControl('')
  });

  constructor() {
    super();
  }

  ngOnInit(): void {
    if (this.route.snapshot.paramMap.get('id') !== null) {
      const id = Number.parseInt(this.route.snapshot.paramMap.get('id') as string);
      this.reportService.getOne(id).subscribe(obj => {
        this.report = obj;
        this.headerService.setPage('nav.report_edit');
        this.objForm = this.fb.group(obj);
        this.objForm.patchValue({reportedAt: obj.reportedAt ? moment(obj.reportedAt) : null});
        this.objForm.addControl('itemId', new UntypedFormControl(obj.item.id));
        this.objForm.addControl('userId', new UntypedFormControl(obj.user.id));
      });
    } else {
      this.headerService.setPage('nav.report_new');
    }

    this.itemService.getList().subscribe(obj => {
      this.items = obj;
    });
    this.userService.getList().subscribe(obj => {
      this.users = obj;
    });
  }

  async back() {
    await this.router.navigate(['reports']);
  }

  async save(formData: any) {
    this.report = Object.assign(new Report(), formData);
    this.report.reportedAt = moment(formData.reportedAt).format('YYYY-MM-DD');
    this.report.item = this.items.find(o => o.id === formData.itemId) as Item;
    this.report.user = this.users.find(o => o.id === formData.userId) as User;

    if (this.report.id) {
      this.reportService.update(this.report).subscribe({
        next: () => {
          this.snackBar.open(this.messageSaved, this.messageClose, {duration: 5000});
          this.back();
        },
        error: () => {
          this.snackBar.open(this.messageError, this.messageClose, {duration: 5000, politeness: 'assertive'});
        }
      });
    } else {
      this.reportService.save(this.report).subscribe({
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
