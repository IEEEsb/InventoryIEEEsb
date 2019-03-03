import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { InventoryService } from '../inventory.service';

import { Purchase } from '../../../models/Purchase';

@Component({
	selector: 'app-purchases-editor',
	templateUrl: './purchases-editor.component.html',
	styleUrls: ['./purchases-editor.component.less']
})
export class PurchasesEditorComponent implements OnInit {

	rawPurchases: Purchase[] = [];
	purchases: Purchase[] = [];
	constructor(private inventoryService: InventoryService, private router: Router) { }

	ngOnInit() {
		this.inventoryService.getPurchases().subscribe((purchases) => {
			this.rawPurchases = purchases;
		});
	}

	edit(purchaseId) {
		this.router.navigate([`/admin/purchase/${purchaseId}`]);
	}

}
