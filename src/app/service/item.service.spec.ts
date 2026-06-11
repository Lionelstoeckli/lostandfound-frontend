import { TestBed } from '@angular/core/testing';

import { ItemService } from './item.service';
import { provideHttpClient } from '@angular/common/http';
import { Item } from '../dataaccess/item';
import { expect } from 'vitest';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { environment } from '../../environments/environment';

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

  it('should return a list of items', async () => {
    service.getList().subscribe({
      next: (data) => {
        expect(data).toHaveLength(fakeItems.length);
      },
    });

    const req = httpMock.expectOne(environment.backendBaseUrl + ItemService.backendUrl);
    expect(req.request.method).toBe('GET');
    req.flush(fakeItems);
  });

  it('should create a new item', async () => {
    const newItem: Item = {
      id: 3,
      name: 'Brille',
      description: 'Lesebrille im Etui',
      color: 'braun',
    };

    service.save(newItem).subscribe({
      next: (item) => {
        expect(item).toEqual(newItem);
      },
    });

    const req = httpMock.expectOne(environment.backendBaseUrl + ItemService.backendUrl);
    expect(req.request.method).toBe('POST');
    req.flush(newItem);
  });

  it('should update an item', async () => {
    const item = fakeItems[0];
    item.name = 'Updated Item';

    service.update(item).subscribe({
      next: (updated) => {
        expect(updated.name).toEqual('Updated Item');
      },
    });

    const req = httpMock.expectOne(
      environment.backendBaseUrl + `${ItemService.backendUrl}/${fakeItems[0].id}`,
    );
    expect(req.request.method).toBe('PUT');
    req.flush(item);
  });

  it('should delete an existing item', async () => {
    service.delete(fakeItems[0].id).subscribe({
      next: (response) => {
        expect(response.status).toBe(200);
      },
    });

    const req = httpMock.expectOne(environment.backendBaseUrl + `${ItemService.backendUrl}/${fakeItems[0].id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(fakeItems[0].id);
  });
});
