import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'template-model',
    loadComponent: () =>
      import('./pages/template-model-editor/template-model-editor.component').then(
        (m) => m.TemplateModelEditorComponent
      ),
  },
  {
    path: '',
    redirectTo: 'template-model',
    pathMatch: 'full',
  },
];
