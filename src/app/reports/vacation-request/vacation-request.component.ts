import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ReportsService } from '../reports.service';

@Component({
  selector: 'app-vacation-request',
  templateUrl: './vacation-request.component.html',
  standalone: false,
})
export class VacationRequestComponent {
  form: FormGroup;
  submitted = false;
  result: any = null;

  constructor(private fb: FormBuilder, private reportsService: ReportsService) {
    this.form = this.fb.group({
      employeeName: ['', Validators.required],
      employeeDNI: ['', Validators.required],
      employeeStartDate: ['', Validators.required],
      employerCompany: ['', Validators.required],
      vacationStartDate: ['', Validators.required],
      vacationEndDate: ['', Validators.required],
      applicableAgreement: ['', Validators.required],
    });
  }

  submit() {
    if (this.form.valid) {
      this.reportsService.generateVacationRequestPdf(this.form.value)
        .subscribe(blob => {
          const url = window.URL.createObjectURL(blob);
          window.open(url, '_blank');

          this.result = this.form.value;
          this.submitted = true;
        });
    }
  }

  reset() {
    this.form.reset();
    this.submitted = false;
    this.result = null;
  }
}
