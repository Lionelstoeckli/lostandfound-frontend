import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {HeaderService} from '../../service/header.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import {Item} from '../../dataaccess/item';
import {BaseComponent} from '../../components/base/base.component';
import {ItemService} from '../../service/item.service';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { AutofocusDirective } from '../../dir/autofocus-dir';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

@Component({
    selector: 'app-item-detail',
    templateUrl: './item-detail.component.html',
    styleUrls: ['./item-detail.component.scss'],
    imports: [MatToolbar, MatToolbarRow, MatButton, MatIcon, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, AutofocusDirective, MatHint, CdkTextareaAutosize, TranslateModule]
})
export class ItemDetailComponent extends BaseComponent implements OnInit {
  private router = inject(Router);
  private headerService = inject(HeaderService);
  private route = inject(ActivatedRoute);
  private itemService = inject(ItemService);
  private snackBar = inject(MatSnackBar);
  private formBuilder = inject(UntypedFormBuilder);


  item = new Item();

  public objForm = new UntypedFormGroup({
    name: new UntypedFormControl(''),
    description: new UntypedFormControl(''),
    color: new UntypedFormControl('')
  });

  constructor() {
    const translate = inject(TranslateService);

    super();

    this.translate = translate;
  }

  ngOnInit(): void {
    if (this.route.snapshot.paramMap.get('id') !== null) {
      const id = Number.parseInt(this.route.snapshot.paramMap.get('id') as string);
      this.itemService.getOne(id).subscribe(obj => {
        this.item = obj;
        this.headerService.setPage('nav.item_edit');
        this.objForm = this.formBuilder.group(obj);
      });
    } else {
      this.headerService.setPage('nav.item_new');
    }
  }

  async back() {
    await this.router.navigate(['items']);
  }

  async save(formData: any) {
    this.item = Object.assign(formData);

    if (this.item.id) {
      this.itemService.update(this.item).subscribe({
        next: () => {
          this.snackBar.open(this.messageSaved, this.messageClose, {duration: 5000});
          this.back();
        },
        error: () => {
          this.snackBar.open(this.messageError, this.messageClose, {duration: 5000, politeness: 'assertive'});
        }
      });
    } else {
      this.itemService.save(this.item).subscribe({
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
