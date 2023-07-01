import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PhPage } from './ph.page';

const routes: Routes = [
  {
    path: '',
    component: PhPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PhPageRoutingModule {}
