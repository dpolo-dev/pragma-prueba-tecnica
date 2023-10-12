import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Cat } from 'src/app/models/cat.model';

@Injectable({
  providedIn: 'root',
})
export class CatService {

  private apiBaseUrl = environment.api;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'API-Key': environment.apiKey,
    }),
  };

  private cats: Cat[] = [];

  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista de gatos desde la API. Si la lista de gatos ya se ha consultado previamente,
   * se devuelve inmediatamente la lista almacenada en la variable de clase `cats`.
   *
   * @returns Un Observable que emite la lista de gatos desde la API.
   */
  getCats(): Observable<Cat[]> {
    if (this.cats.length > 0) {
      return of(this.cats);
    }

    const url = `${this.apiBaseUrl}/v1/breeds`;

    return this.http.get<any[]>(url, this.httpOptions).pipe(
      map((data) => this.transformData(data)),
      switchMap((cats) => this.fetchCatImages(cats)),
      map((catsWithImages) => {
        this.cats = catsWithImages; // Almacenar los gatos con imágenes
        return catsWithImages;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Transforma los datos de la API en objetos Cat.
   *
   * @param data Datos de la API.
   * @returns Un arreglo de objetos Cat.
   */
  private transformData(data: any[]): Cat[] {
    return data.map(item => ({
      breedName: item.name,
      origin: item.origin,
      affectionLevel: item.affection_level,
      reference_image_id: item.reference_image_id,
      imageUrl: '',
      energyLevel: item.energy_level,
      intelligence: item.intelligence,
      wikipediaUrl: item.wikipedia_url,
      altNames: item.alt_names,
      adaptability: item.adaptability,
      socialNeeds: item.social_needs,
      strangerFriendly: item.stranger_friendly,
    }));
  }

  /**
   * Obtiene las URL de las imágenes de los gatos a partir de sus reference_image_id.
   *
   * @param cats Arreglo de gatos.
   * @returns Un Observable que emite un arreglo de URLs de imágenes.
   */
  private fetchImageUrls(cats: Cat[]): Observable<string[]> {
    const imageRequests = cats
      .filter(cat => cat.reference_image_id)
      .map(cat => {
        const imageUrl = `${this.apiBaseUrl}/v1/images/${cat.reference_image_id}`;
        return this.http.get<any>(imageUrl, this.httpOptions).pipe(
          map(imageData => imageData.url)
        );
      });

    return forkJoin(imageRequests);
  }

  /**
   * Combina los gatos con sus respectivas URLs de imágenes. En caso de que imageUrl esté vacío, se agrega una imagen por defecto.
   *
   * @param cats Arreglo de gatos.
   * @returns Un Observable que emite un arreglo de gatos con URLs de imágenes.
   */
  private fetchCatImages(cats: Cat[]): Observable<Cat[]> {
    return this.fetchImageUrls(cats).pipe(
      map((imageUrls) => {
        cats.forEach((cat, index) => {
          cat.imageUrl = imageUrls[index] || environment.defaultImgCat;
        });
        return cats;
      })
    );
  }


  /**
   * Maneja errores en las solicitudes HTTP.
   *
   * @param error Error HTTP.
   * @returns Un Observable que emite un mensaje de error.
   */
  private handleError(error: any): Observable<never> {
    console.error('Error en la solicitud:', error);
    return new Observable<never>((observer) => {
      observer.error('Error al obtener la lista de gatos');
      observer.complete();
    });
  }
}
