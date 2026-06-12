import { TestBed } from '@angular/core/testing';

import { ItemService } from './item.service';
import { provideHttpClient } from '@angular/common/http';
import { Item } from '../dataaccess/item';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { environment } from '../../environments/environment';

// Wichtigster Service der Applikation – es werden ALLE Methoden getestet:
// getList, getOne, save, update, delete.
describe('ItemService', () => {
  let service: ItemService;
  let httpMock: HttpTestingController;

  const fakeItems: Item[] = [
    {
      id: 1,
      name: 'Regenschirm',
      description: 'Schwarzer Regenschirm',
      color: 'schwarz',
    },
    {
      id: 2,
      name: 'Schlüsselbund',
      description: 'Drei Schlüssel am Ring',
      color: 'silber',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
      teardown: { destroyAfterEach: true },
    });
    service = TestBed.inject(ItemService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getList() should return a list of items', () => {
    service.getList().subscribe((data) => {
      expect(data).toHaveLength(fakeItems.length);
    });

    const req = httpMock.expectOne(environment.backendBaseUrl + ItemService.backendUrl);
    expect(req.request.method).toBe('GET');
    req.flush(fakeItems);
  });

  it('getOne() should return a single item', () => {
    service.getOne(1).subscribe((item) => {
      expect(item).toEqual(fakeItems[0]);
    });

    const req = httpMock.expectOne(environment.backendBaseUrl + `${ItemService.backendUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(fakeItems[0]);
  });

  it('save() should create a new item', () => {
    const newItem: Item = {
      id: 3,
      name: 'Brille',
      description: 'Lesebrille im Etui',
      color: 'braun',
    };

    service.save(newItem).subscribe((item) => {
      expect(item).toEqual(newItem);
    });

    const req = httpMock.expectOne(environment.backendBaseUrl + ItemService.backendUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newItem);
    req.flush(newItem);
  });

  it('update() should update an item', () => {
    const item = fakeItems[0];
    item.name = 'Updated Item';

    service.update(item).subscribe((updated) => {
      expect(updated.name).toEqual('Updated Item');
    });

    const req = httpMock.expectOne(
      environment.backendBaseUrl + `${ItemService.backendUrl}/${fakeItems[0].id}`,
    );
    expect(req.request.method).toBe('PUT');
    req.flush(item);
  });

  it('delete() should delete an existing item', () => {
    service.delete(fakeItems[0].id).subscribe((response) => {
      expect(response.status).toBe(200);
    });

    const req = httpMock.expectOne(environment.backendBaseUrl + `${ItemService.backendUrl}/${fakeItems[0].id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(fakeItems[0].id);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
