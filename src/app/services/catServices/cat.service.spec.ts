import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { CatService } from './cat.service';
import { environment } from 'src/environments/environment';
import { Cat } from 'src/app/models/cat.model';

describe('CatService', () => {
    let injector: TestBed;
    let httpMock: HttpTestingController;
    let catService: CatService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [CatService],
        });
        injector = getTestBed();
        httpMock = injector.get(HttpTestingController);
        catService = injector.get(CatService);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(catService).toBeTruthy();
    });

    it('should return a list of cats', () => {
        const mockCats: Cat[] = [
            {
                breedName: 'Cat 1',
                origin: 'Origin 1',
                affectionLevel: 5,
                imageUrl: 'image1.jpg',
            },
            {
                breedName: 'Cat 2',
                origin: 'Origin 2',
                affectionLevel: 4,
                imageUrl: 'image2.jpg',
            },
        ];

        catService.getCats().subscribe((cats: Cat[]) => {
            expect(cats).toEqual(mockCats);
        });

        const req = httpMock.expectOne(`${environment.api}/v1/breeds`);
        expect(req.request.method).toBe('GET');
        req.flush(mockCats);
    });

    it('should handle errors', () => {
        const errorMessage = 'Error in the API';

        catService.getCats().subscribe(
            () => {
                // This should not be called in case of success
                fail('Expected an error, but got a successful response');
            },
            (error: any) => {
                expect(error).toBe('Error al obtener la lista de gatos');
            }
        );

        const req = httpMock.expectOne(`${environment.api}/v1/breeds`);
        expect(req.request.method).toBe('GET');
        req.error(new ErrorEvent('Network error', { message: errorMessage }));
    });
});
