import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatPaginatorModule } from '@angular/material/paginator'; // Si usas Angular Material
import { ImagesComponent } from './images.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ImagesComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MatPaginatorModule,
    FormsModule
  ],
  exports: [
    ImagesComponent,
  ],
})
export class ImagesModule {}
