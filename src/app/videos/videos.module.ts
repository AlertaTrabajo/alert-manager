import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatPaginatorModule } from '@angular/material/paginator'; // Si usas Angular Material
import { VideosComponent } from './videos.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    VideosComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MatPaginatorModule,
    FormsModule
  ],
  exports: [
    VideosComponent,
  ],
})
export class VideosModule {}
