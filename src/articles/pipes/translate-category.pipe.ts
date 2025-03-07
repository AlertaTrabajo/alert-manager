import { Pipe, PipeTransform } from '@angular/core';
import { ArticleCategory } from '../enums/article-category.entum';

@Pipe({
  name: 'translateArticleCategory',
  standalone: false,
})
export class TranslateArticleCategoryPipe implements PipeTransform {
  private translations: { [key in ArticleCategory]: string } = {
    [ArticleCategory.VacationLeave]: 'Vacaciones y Permisos',
    [ArticleCategory.LaborRights]: 'Derechos Laborales',
    [ArticleCategory.HealthSafety]: 'Salud y Seguridad',
    [ArticleCategory.LawsRegulations]: 'Leyes y Regulaciones',
    [ArticleCategory.PracticalAdvice]: 'Consejos Prácticos',
    [ArticleCategory.Others]: 'Otras Categorías'
  };

  transform(value: ArticleCategory): string {
    return this.translations[value] || 'Categoría Desconocida';
  }
}
