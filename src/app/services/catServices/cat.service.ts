import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
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

    return this.http.get<Cat[]>(url, this.httpOptions).pipe(
      tap(cats => this.cats = cats),
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Error en la solicitud:', error);
    return new Observable<never>((observer) => {
      observer.error('Error al obtener la lista de gatos');
      observer.complete();
    });
  }
}
