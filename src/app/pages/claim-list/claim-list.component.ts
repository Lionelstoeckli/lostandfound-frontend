import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import {HeaderService} from '../../service/header.service';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import {ConfirmDialogComponent} from '../../components/confirm-dialog/confirm-dialog.component';
import {Claim} from '../../dataaccess/claim';
import {BaseComponent} from '../../components/base/base.component';
import {ClaimService} from '../../service/claim.service';
import { IsInRoleDirective } from '../../dir/is.in.role.dir';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-claim-list',
    templateUrl: './claim-list.component.html',
    styleUrls: ['./claim-list.component.scss'],
    imports: [IsInRoleDirective, MatToolbar, MatButton, MatIcon, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatPaginator, DatePipe, TranslateModule]
})
export class ClaimListComponent extends BaseComponent implements OnInit, AfterViewInit {
  private claimService = inject(ClaimService);
  private dialog = inject(MatDialog);
  private headerService = inject(HeaderService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  claimDataSource = new MatTableDataSource<Claim>();
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  columns = ['message', 'status', 'createdAt', 'report', 'user', 'actions'];

  public constructor() {
    super();
    this.headerService.setPage('nav.claims');
  }

  async ngOnInit() {
    await this.reloadData();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.claimDataSource.paginator = this.paginator;
    }
  }

  reloadData() {
    this.claimService.getList().subscribe(obj => {
      this.claimDataSource.data = obj;
    });
  }

  async edit(e: Claim) {
    await this.router.navigate(['claim', e.id]);
  }

  async add() {
    await this.router.navigate(['claim']);
  }

  delete(e: Claim) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'dialogs.title_delete',
        message: 'dialogs.message_delete'
      }
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === true) {
        this.claimService.delete(e.id).subscribe({
          next: response => {
            if (response.status === 200) {
              this.snackBar.open(this.deletedMessage, this.closeMessage, {duration: 5000});
              this.reloadData();
            } else {
              this.snackBar.open(this.deleteErrorMessage, this.closeMessage, {duration: 5000});
            }
          },
          error: () => this.snackBar.open(this.deleteErrorMessage, this.closeMessage, {duration: 5000})
        });
      }
    });
  }
}
