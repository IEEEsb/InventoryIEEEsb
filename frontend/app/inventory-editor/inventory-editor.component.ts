import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { InventoryService } from '../inventory.service';

import { Item } from '../../../models/Item';

@Component({
	selector: 'app-inventory-editor',
	templateUrl: './inventory-editor.component.html',
	styleUrls: ['./inventory-editor.component.less']
})
export class InventoryEditorComponent implements OnInit {

	items: Item[] = [];
	rawItems: Item[] = [];
	constructor(private inventoryService: InventoryService, private router: Router) { }

	ngOnInit() {
		this.inventoryService.getConsumableItems().subscribe((items) => {
			this.rawItems = items;
		});
	}

	edit(itemId) {
		this.router.navigate([`/admin/inventory/${itemId}`]);
	}

}
