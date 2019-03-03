import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { InventoryService } from '../inventory.service';

import { Item } from '../../../models/Item';

@Component({
	selector: 'app-item',
	templateUrl: './item.component.html',
	styleUrls: ['./item.component.less']
})
export class ItemComponent implements OnInit {

	item: Item = {};
	error;

	constructor(private inventoryService: InventoryService, private router: Router, private route: ActivatedRoute) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			if (params['itemId']) {
				this.inventoryService.getItem(params['itemId']).subscribe(
					(data) => {
						this.item = data.item;
						this.error = null;
					},
					(error) => {
						this.error = error;
					}
				);
			}
		});
	}

}
