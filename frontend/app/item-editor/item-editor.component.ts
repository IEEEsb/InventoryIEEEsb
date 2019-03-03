import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { InventoryService } from '../inventory.service';

import { Item } from '../../../models/Item';

@Component({
	selector: 'app-item-editor',
	templateUrl: './item-editor.component.html',
	styleUrls: ['./item-editor.component.less']
})
export class ItemEditorComponent implements OnInit {

	editing = false;
	item: Item = {};
	tags = [];
	error;

	constructor(private inventoryService: InventoryService, private router: Router, private route: ActivatedRoute) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			if (params['itemId']) {
				this.editing = true;
				this.inventoryService.getItem(params['itemId']).subscribe(
					(data) => {
						this.item = data.item;
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

		this.inventoryService.getTags().subscribe(
			(data) => {
				this.tags = data.tags;
			},
			error => {
				this.error = error;
			}
		);
	}

	addTag(tag) {
		console.log(tag)
		if(!this.item.tags) {
			this.item.tags = [];
		}
		console.log(this.item.tags.indexOf(tag));
		if (this.item.tags.indexOf(tag) > -1) return;

		this.item.tags.push(tag);
		console.log(this.item)
	}

	removeTag(tag) {
		if(this.item.tags.indexOf(tag) <= 0) return;
		this.item.tags.splice(this.item.tags.indexOf(tag), 1);
	}

	addItem() {
		this.inventoryService.addItem(this.item).subscribe(
			(data) => {
				this.router.navigate(['/admin/inventory/' + data.item._id]);
				this.error = null;
			},
			error => {
				this.error = error;
			}
		);
	}

	updateItem() {
		this.inventoryService.updateItem(this.item._id, this.item).subscribe(
			(data) => {
				this.item = data.item;
				this.error = null;
				this.inventoryService.getTags().subscribe(
					(data) => {
						this.tags = data.tags;
					},
					error => {
						this.error = error;
					}
				);
			},
			error => {
				this.error = error;
			}
		);
	}

	removeItem() {
		if(confirm("¿Seguro que quieres borrar el producto?")) {
			this.inventoryService.removeItem(this.item._id).subscribe(
				() => {
					this.router.navigate(['/admin/inventory']);
					this.error = null;
				},
				error => {
					this.error = error;
				}
			);
		}
	}



}
