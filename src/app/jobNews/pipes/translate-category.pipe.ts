import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translateCategory',
  standalone: true
})
export class TranslateCategoryPipe implements PipeTransform {
  private translations: { [key: string]: string } = {
    labor_conflicts: 'Conflictos Laborales',
    salaries: 'Salarios',
    accidents: 'Accidentes Laborales',
    legal_news: 'Leyes Laborales',
    public_jobs: 'Empleo Publico',
    health_safety: 'Seguridad y Salud',
    social_security: 'Seguridad Social',
    worker_rights: 'Derechos laborales',
    dismissals: 'Despidos',
    work_life: 'Conciliación Laboral y Familiar',
    national_news: 'Noticias Nacionales',
    laws_regulations: 'Leyes y Regulaciones',
    other: 'Otras Noticias'
  };

  transform(value: string): string {
    return this.translations[value] || 'Categoría Desconocida';
  }
}
