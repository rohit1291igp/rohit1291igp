import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { BannerPanelComponent } from 'app/components/banner-panel/banner-panel.component';
import { NewReportsComponentModule } from 'app/components/new-reports-component/new-reports.component';
import { AuthGuard } from 'app/services/auth-guard.service';
import { SharedModule } from 'app/shared-module/shared/shared.module';
import { OfferPageManagementComponent } from 'app/components/offer-page-management/offer-page-management.component';

const routes: Routes = [
  {
    path: 'banner',
    component: BannerPanelComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'offerpagemanagement',
    component: OfferPageManagementComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    SharedModule,
    MatSlideToggleModule,
    NewReportsComponentModule
  ],
  declarations: [
    BannerPanelComponent,
    OfferPageManagementComponent
  ]
})
export class MarketingModule { }
