import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { BannerPanelComponent } from 'app/components/banner-panel/banner-panel.component';
import { DownloadEmailComponent } from 'app/components/download-email/download-email.component';
import { MenuListItemComponent } from 'app/components/menu-list-item/menu-list-item.component';
import { NewDasboardComponent } from 'app/components/new-dashboard/new-dashboard.component';
import { NewReportsComponentModule } from 'app/components/new-reports-component/new-reports.component';
import { PendingOrderComponent } from 'app/components/pending-order/pending-order.component';
import { SearchRankingComponent } from 'app/components/search-ranking/search-ranking.component';
import { AuthGuard } from 'app/services/auth-guard.service';
import { NavService } from 'app/services/NewService';
import { UserAccessService } from 'app/services/user-access.service';
import { SharedModule } from 'app/shared-module/shared/shared.module';
import { MyDatePickerModule } from 'mydatepicker';


const routes: Routes = [{
  path: '',
  component: NewDasboardComponent,
  children: [{
    path: 'sendemail',
    loadChildren: './sendemail.module#SendEmailModule',
    canActivate: [AuthGuard]
  }, {
    path: 'egv',
    loadChildren: './egvpanel.module#EgvpanelModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'handels',
    loadChildren: './handels.module#HandelsModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'warehouse',
    loadChildren: './warehouse.module#WareHouseModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'marketing',
    loadChildren: './marketing.module#MarketingModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    loadChildren: './dashboard.module#DashboardModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'searchRanking',
    component: SearchRankingComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard-microsite',
    loadChildren: './microsite.module#MicroSiteModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'voucher-generation',
    loadChildren: './microsite.module#MicroSiteModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'voucher-generation-whitelabel',
    loadChildren: './microsite.module#MicroSiteModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'pending-orders',
    component: PendingOrderComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'download/:fileFor/:filedate/:fileTime',
    component: DownloadEmailComponent,
    canActivate: [AuthGuard]
  }
  ]
}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MyDatePickerModule,
    SharedModule,
    MatSlideToggleModule,
    NewReportsComponentModule
  ],
  declarations: [
    NewDasboardComponent,
    MenuListItemComponent,
    SearchRankingComponent,
    PendingOrderComponent,
    DownloadEmailComponent
  ],
  providers: [NavService, UserAccessService],
  entryComponents: []
})
export class NewDashboardModule { }
