import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { VacationRequestComponent } from './vacation-request/vacation-request.component';

@NgModule({
  declarations: [VacationRequestComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: []
})
export class ReportsModule {}
