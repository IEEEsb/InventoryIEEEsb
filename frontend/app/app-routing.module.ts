import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoggedInGuard } from './guards.guard'

import { InventoryComponent } from './inventory/inventory.component'
import { LoginComponent } from './login/login.component'
import { MainComponent } from './main/main.component'
import { HomeComponent } from './home/home.component'
import { AdminComponent } from './admin/admin.component'
import { InventoryEditorComponent } from './inventory-editor/inventory-editor.component'
import { ItemEditorComponent } from './item-editor/item-editor.component'
import { ItemComponent } from './item/item.component'
import { UsersEditorComponent } from './users-editor/users-editor.component'
import { UserEditorComponent } from './user-editor/user-editor.component'
import { ProfileComponent } from './profile/profile.component'
import { PurchasesEditorComponent } from './purchases-editor/purchases-editor.component'
import { PurchaseEditorComponent } from './purchase-editor/purchase-editor.component'
import { PurchaseItemEditorComponent } from './purchase-item-editor/purchase-item-editor.component'


const routes: Routes = [
	{
		path: '', component: MainComponent, children: [
			{ path: '', component: HomeComponent },
			{ path: 'buy', canActivate:[LoggedInGuard], component: InventoryComponent },
			{ path: 'inventory/:itemId', canActivate:[LoggedInGuard], component: ItemComponent },
			{ path: 'profile', canActivate:[LoggedInGuard], component: ProfileComponent },
			{ path: 'login', component: LoginComponent },
		]
	},
	{
		path: 'admin', component: AdminComponent, canActivate:[LoggedInGuard], children: [
			{ path: '', component: HomeComponent },
			{ path: 'inventory', component: InventoryEditorComponent },
			{ path: 'inventory/add', component: ItemEditorComponent },
			{ path: 'inventory/:itemId', component: ItemEditorComponent },
			{ path: 'purchase', component: PurchasesEditorComponent },
			{ path: 'purchase/add', component: PurchaseEditorComponent },
			{ path: 'purchase/:purchaseId', component: PurchaseEditorComponent },
			{ path: 'purchase/:purchaseId/item/add', component: PurchaseItemEditorComponent },
			{ path: 'purchase/:purchaseId/item/:itemId', component: PurchaseItemEditorComponent },
			{ path: 'users', component: UsersEditorComponent },
			{ path: 'users/:userId', component: UserEditorComponent },
			{ path: 'login', component: LoginComponent },
		]
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true, enableTracing: false })],
	exports: [RouterModule]
})
export class AppRoutingModule { }
