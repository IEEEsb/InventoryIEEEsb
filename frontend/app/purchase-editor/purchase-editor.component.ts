import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { InventoryService } from '../inventory.service';

import { Purchase } from '../../../models/Purchase';

@Component({
	selector: 'app-purchase-editor',
	templateUrl: './purchase-editor.component.html',
	styleUrls: ['./purchase-editor.component.less']
})
export class PurchaseEditorComponent implements OnInit {

	editing = false;
	purchase: Purchase = {};
	tags = [];
	error;

	constructor(private inventoryService: InventoryService, private router: Router, private route: ActivatedRoute) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			if (params['purchaseId']) {
				this.editing = true;
				this.inventoryService.getPurchase(params['purchaseId']).subscribe(
					(data) => {
						this.purchase = data.purchase;
						this.error = null;
					},
					(error) => {
						this.error = error;
					}
				);
			} else {
				this.editing = false;
			}
		});
	}

	startPurchase() {
		this.inventoryService.startPurchase(this.purchase).subscribe(
			(data) => {
				this.router.navigate(['/admin/purchase/' + data.purchase._id]);
				this.error = null;
			},
			error => {
				this.error = error;
			}
		);
	}

	endPurchase() {
		this.inventoryService.endPurchase(this.purchase._id).subscribe(
			(data) => {
				this.purchase = data.purchase;
				this.error = null;
			},
			error => {
				this.error = error;
			}
		);
	}

	updatePurchase() {
		this.inventoryService.updatePurchase(this.purchase._id, this.purchase).subscribe(
			(data) => {
				this.purchase = data.purchase;
				this.error = null;
			},
			error => {
				this.error = error;
			}
		);
	}

	removePurchase() {
		if(confirm("¿Seguro que quieres borrar la compra?")) {
			this.inventoryService.removePurchase(this.purchase._id).subscribe(
				() => {
					this.router.navigate(['/admin/purchase']);
					this.error = null;
				},
				error => {
					this.error = error;
				}
			);
		}
	}

}
