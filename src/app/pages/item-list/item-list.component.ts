import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import {HeaderService} from '../../service/header.service';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import {ConfirmDialogComponent} from '../../components/confirm-dialog/confirm-dialog.component';
import {Item} from '../../dataaccess/item';
import {BaseComponent} from '../../components/base/base.component';
import {ItemService} from '../../service/item.service';
import { IsInRoleDirective } from '../../dir/is.in.role.dir';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-item-list',
    templateUrl: './item-list.component.html',
    styleUrls: ['./item-list.component.scss'],
    imports: [IsInRoleDirective, MatToolbar, MatButton, MatIcon, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatPaginator, TranslateModule]
})
export class ItemListComponent extends BaseComponent implements OnInit, AfterViewInit {
  private itemService = inject(ItemService);
  private dialog = inject(MatDialog);
  private headerService = inject(HeaderService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  itemDataSource = new MatTableDataSource<Item>();
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  columns = ['name', 'description', 'color', 'actions'];

  public constructor() {
    super()
    this.headerService.setPage('nav.items');
  }

  async ngOnInit() {
    await this.reloadData();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.itemDataSource.paginator = this.paginator;
    }
  }

  reloadData() {
    this.itemService.getList().subscribe(obj => {
      this.itemDataSource.data = obj;
    });
  }

  async edit(e: Item) {
    await this.router.navigate(['item', e.id]);
  }

  async add() {
    await this.router.navigate(['item']);
  }

  delete(e: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'dialogs.title_delete',
        message: 'dialogs.message_delete'
      }
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === true) {
        this.itemService.delete(e.id).subscribe({
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
