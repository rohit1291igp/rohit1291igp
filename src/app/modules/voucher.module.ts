import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MatButtonModule, MatCardModule, MatDatepickerModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatMenuModule, MatPaginatorModule, MatRadioModule, MatSelectModule, MatSnackBarModule, MatSortModule, MatTableModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { CouponComponent } from 'app/components/coupon/coupon.component';
import { ApiService } from 'app/services/api.service';
import { MyDatePickerModule } from 'mydatepicker';
import { HeaderInterceptor } from '../others/header-request.interceptor';
import { ResponseInterceptor } from '../others/api-response.interceptor';
import { GiftsVoucherComponent, GiftVoucherDialog } from 'app/components/gifts-voucher/gifts-voucher.component';
import { VoucherModelComponent } from 'app/components/voucher-model/voucher-model.component';
import { VoucherComponent } from 'app/components/voucher/voucher.component';
import { FilterPipeModule } from 'app/customPipes/filter.pipe';
import { GvComponent } from 'app/components/gv/gv.component';


const routes: Routes = [
    {
        path: 'voucher',
        component: VoucherComponent
    },
    {
        path: 'gv',
        component: VoucherComponent
    },
    {
        path: 'gifts-voucher',
        component: GiftsVoucherComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        HttpModule,
        HttpClientModule,
        ReactiveFormsModule,
        MyDatePickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatCardModule,
        MatButtonModule,
        MatMenuModule,
        MatDialogModule,
        MatSnackBarModule,
        CdkTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatDatepickerModule,
        MatRadioModule,
        MatSelectModule,
        FilterPipeModule
    ],
    declarations: [
        CouponComponent,
        GiftsVoucherComponent,
        GiftVoucherDialog,
        VoucherComponent,
        VoucherModelComponent,
        GvComponent
    ],
    exports : [
        MatSelectModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HeaderInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ResponseInterceptor,
            multi: true
        },
        ApiService],
        entryComponents:[GiftVoucherDialog]
})
export class VoucherModule { }
