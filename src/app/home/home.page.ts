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

  constructor(
    private catService: CatService
  ) {}

  ngOnInit() {
    this.getCats();
  }

  getCats() {
    this.catService.getCats().subscribe({
      next: (cats: Cat[]) => {
        this.cats = cats;
      },
      error: (error: any) => {
        console.error('Error al obtener la lista de gatos:', error);
      }
    });
  }

}
