import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { InventoryService } from '../inventory.service';

import { Item } from '../../../models/Item';

@Component({
	selector: 'app-inventory',
	templateUrl: './inventory.component.html',
	styleUrls: ['./inventory.component.less']
})
export class InventoryComponent implements OnInit {

	items: Item[] = [];
	search = '';

	constructor(private inventoryService: InventoryService, private router: Router) { }

	ngOnInit() {
		this.inventoryService.getConsumableItems().subscribe((items) => {
			this.items = items;
		});
	}

	transaction(quantity, itemId) {
		const item = this.items.find(item => item._id.toString() === itemId);
		if (!confirm(`¿Seguro que quieres comprar ${quantity} ${item.name}?`)) return;
		this.inventoryService.buyItem(itemId, quantity).subscribe(
			(data) => { },
			(error) => {
				alert(error);
			}
		);
	}

	view(itemId) {
		this.router.navigate([`/inventory/${itemId}`]);
	}

}
