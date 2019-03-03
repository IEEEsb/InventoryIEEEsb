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

	rawItems: Item[] = [];
	items: Item[] = [];
	search = '';

	constructor(private inventoryService: InventoryService, private router: Router) { }

	ngOnInit() {
		this.inventoryService.getConsumableItems().subscribe((items) => {
			this.rawItems = items;
		});
	}

	transaction(quantity, itemId) {
		this.inventoryService.buyItem(itemId, quantity).subscribe(
			(data) => {},
			(error) => {
				alert(error);
			}
		);
	}

	view(itemId) {
		this.router.navigate([`/inventory/${itemId}`]);
	}

}
