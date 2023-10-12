import { Component, OnInit } from '@angular/core';
import { Cat } from '../models/cat.model';
import { CatService } from '../services/catServices/cat.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  cats: Cat[] = [];
  filteredCats: Cat[] = [];
  searchText: string = '';

  constructor(
    private catService: CatService
  ) { }

  /**
   * Se ejecuta al inicializar el componente y llama a la función `getCats`
   * para cargar la lista de razas de gatos.
   */
  ngOnInit() {
    this.getCats();
  }

  /**
   * Obtiene la lista de razas de gatos desde el servicio `CatService` y actualiza
   * la propiedad `cats` del componente.
   */
  getCats() {
    this.catService.getCats().subscribe({
      next: (cats: Cat[]) => {
        this.cats = cats;
        this.filteredCats = cats;
      },
      error: (error: any) => {
        console.error('Error al obtener la lista de gatos:', error);
      }
    });
  }

  filterCats() {
    this.filteredCats = this.cats.filter(cat => {
      return (
        cat.breedName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        cat.origin.toLowerCase().includes(this.searchText.toLowerCase())
      );
    });
  }
}
