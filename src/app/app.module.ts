import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { PurchaseOrderFormComponent } from './purchase-order/purchase-order-form/purchase-order-form.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PurchaseOrderComponent,
    PurchaseOrderFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule
  ],
  exports: [
    PurchaseOrderFormComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
