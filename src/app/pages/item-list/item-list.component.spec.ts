import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemListComponent } from './item-list.component';
import { HttpResponse, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, provideRouter } from '@angular/router';
import { AuthConfig, OAuthModule } from 'angular-oauth2-oidc';
import { provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { authConfig } from '../../../app/app.config';
import { ItemService } from '../../service/item.service';
import { Item } from '../../dataaccess/item';

// Wichtigste Komponente der Applikation – es werden ALLE Methoden getestet:
// reloadData, add, edit und delete (inkl. bestaetigtem und abgebrochenem Loeschen).
describe('ItemListComponent', () => {
  let component: ItemListComponent;
  let fixture: ComponentFixture<ItemListComponent>;
  let router: Router;
  let dialog: MatDialog;
  let snackBar: MatSnackBar;

  const fakeItems: Item[] = [
    { id: 1, name: 'Regenschirm', description: '', color: 'schwarz' },
    { id: 2, name: 'Brille', description: '', color: 'braun' },
  ];

  const itemServiceMock = {
    getList: vi.fn(() => of(fakeItems)),
    delete: vi.fn(() => of(new HttpResponse<string>({ status: 200 }))),
  };

  beforeEach(async () => {
    itemServiceMock.getList.mockClear();
    itemServiceMock.delete.mockClear();

    await TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        MatSnackBarModule,
        OAuthModule.forRoot({ resourceServer: { sendAccessToken: true } }),
        ItemListComponent,
      ],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: AuthConfig, useValue: authConfig },
        { provide: ItemService, useValue: itemServiceMock },
        provideTranslateService({ fallbackLang: 'de_CH', lang: 'de_CH' }),
      ],
      teardown: { destroyAfterEach: true },
    }).compileComponents();

    fixture = TestBed.createComponent(ItemListComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    dialog = TestBed.inject(MatDialog);
    snackBar = TestBed.inject(MatSnackBar);
    fixture.detectChanges(); // triggert ngOnInit -> reloadData
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('reloadData() should load items into the data source', () => {
    component.reloadData();
    expect(itemServiceMock.getList).toHaveBeenCalled();
    expect(component.itemDataSource.data).toEqual(fakeItems);
  });

  it('add() should navigate to the new item page', async () => {
    const navSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    await component.add();
    expect(navSpy).toHaveBeenCalledWith(['item']);
  });

  it('edit() should navigate to the item edit page', async () => {
    const navSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    await component.edit(fakeItems[0]);
    expect(navSpy).toHaveBeenCalledWith(['item', fakeItems[0].id]);
  });

  it('delete() should delete the item after confirmation', () => {
    vi.spyOn(dialog, 'open').mockReturnValue({ afterClosed: () => of(true) } as never);
    vi.spyOn(snackBar, 'open').mockReturnValue({} as never);

    component.delete(fakeItems[0]);

    expect(itemServiceMock.delete).toHaveBeenCalledWith(fakeItems[0].id);
  });

  it('delete() should do nothing when not confirmed', () => {
    vi.spyOn(dialog, 'open').mockReturnValue({ afterClosed: () => of(false) } as never);

    component.delete(fakeItems[0]);

    expect(itemServiceMock.delete).not.toHaveBeenCalled();
  });
});
