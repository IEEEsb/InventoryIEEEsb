import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularIEEEsbLibModule } from 'angular-ieeesb-lib';

import { UserService } from './user.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ScopePipe } from './scope.pipe';
import { LoginComponent } from './login/login.component';
import { InventoryComponent } from './inventory/inventory.component';
import { MainComponent } from './main/main.component';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { InventoryEditorComponent } from './inventory-editor/inventory-editor.component';
import { ItemEditorComponent } from './item-editor/item-editor.component';
import { ItemShortComponent } from './item-short/item-short.component';
import { ItemComponent } from './item/item.component';
import { UsersEditorComponent } from './users-editor/users-editor.component';
import { UserEditorComponent } from './user-editor/user-editor.component';
import { ProfileComponent } from './profile/profile.component';
import { SearchComponent } from './search/search.component';
import { PurchasesEditorComponent } from './purchases-editor/purchases-editor.component';
import { PurchaseEditorComponent } from './purchase-editor/purchase-editor.component';
import { PurchaseItemEditorComponent } from './purchase-item-editor/purchase-item-editor.component';

@NgModule({
	declarations: [
		AppComponent,
		ScopePipe,
		LoginComponent,
		InventoryComponent,
		MainComponent,
		HomeComponent,
		AdminComponent,
		InventoryEditorComponent,
		ItemEditorComponent,
		ItemShortComponent,
		ItemComponent,
		UsersEditorComponent,
		UserEditorComponent,
		ProfileComponent,
		SearchComponent,
		PurchasesEditorComponent,
		PurchaseEditorComponent,
		PurchaseItemEditorComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		BrowserAnimationsModule,
		AngularIEEEsbLibModule.forRoot(),
		NgbModule
	],
	providers: [
		UserService,
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
