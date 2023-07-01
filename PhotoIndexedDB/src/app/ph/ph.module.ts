import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PhPageRoutingModule } from './ph-routing.module';

import { PhPage } from './ph.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PhPageRoutingModule
  ],
  declarations: [PhPage]
})
export class PhPageModule {}
