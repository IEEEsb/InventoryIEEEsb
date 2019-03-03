import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { InventoryService } from '../inventory.service';

import { Item } from '../../../models/Item';
import { Purchase } from '../../../models/Purchase';

@Component({
	selector: 'app-purchase-item-editor',
	templateUrl: './purchase-item-editor.component.html',
	styleUrls: ['./purchase-item-editor.component.less']
})
export class PurchaseItemEditorComponent implements OnInit {

	code = '';
	item: Item;
	purchaseItem: any;
	purchase: Purchase = {};
	editing = false;

	constructor(private inventoryService: InventoryService, private router: Router, private route: ActivatedRoute) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			if (params['purchaseId']) {
				this.inventoryService.getPurchase(params['purchaseId']).subscribe(
					(data) => {
						this.purchase = data.purchase;
						if (params['itemId']) {
							this.purchaseItem = this.purchase.items.find((el) => el.item._id === params['itemId']);
							this.purchaseItem.quantityLeft = this.purchaseItem.quantityLeft.real;
							if(this.purchaseItem) {
								this.item = this.purchaseItem.item;
								this.editing = true;
							}
						}
					},
					(error) => {
						this.router.navigate(['/admin/purchase/']);
					}
				);
			} else {
				this.editing = false;
			}
		});
	}

	search() {
		this.inventoryService.getItemByCode(this.code).subscribe(
			(data) => {
				this.purchaseItem = this.purchase.items.find((el) => el.item === data.item._id);
				if(!this.purchaseItem) {
					this.purchaseItem = {};
				}
				this.item = data.item;

			}
		);
	}

	addItem() {
		this.inventoryService.addPurchaseItem(this.purchase._id, this.item._id, this.purchaseItem).subscribe(
			(data) => {
				this.code = '';
				this.item = null;
			}
		);
	}

	updateItem() {
		this.inventoryService.updatePurchaseItem(this.purchase._id, this.item._id, this.purchaseItem).subscribe(
			(data) => {
				this.purchase = data.purchase;
				this.purchaseItem = this.purchase.items.find((el) => el.item === this.item._id);
				if(this.purchaseItem) {
					this.item = this.purchaseItem.item;
					this.editing = true;
				}
			}
		)
	}

}
