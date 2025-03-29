import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translateCategory',
  standalone: true
})
export class TranslateCategoryPipe implements PipeTransform {
  private translations: { [key: string]: string } = {
    'labor-conflicts': 'Conflictos Laborales',
    'salaries': 'Salarios',
    'accidents': 'Accidentes Laborales',
    'legal-news': 'Leyes Laborales',
    'public-jobs': 'Empleo Publico',
    'health-safety': 'Seguridad y Salud',
    'social-security': 'Seguridad Social',
    'worker-rights': 'Derechos laborales',
    'dismissals': 'Despidos',
    'work-life': 'Conciliación Laboral y Familiar',
    'national-news': 'Noticias Nacionales',
    'laws-regulations': 'Leyes y Regulaciones',
    'other': 'Otras Noticias'
  };

  transform(value: string): string {
    return this.translations[value] || 'Categoría Desconocida';
  }
}
