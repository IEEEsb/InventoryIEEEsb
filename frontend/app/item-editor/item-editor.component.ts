import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { DriveService } from 'angular-ieeesb-lib';
import { InventoryService } from '../inventory.service';

import { Item } from '../../../models/Item';

const config = require('../../../config.json');

@Component({
	selector: 'app-item-editor',
	templateUrl: './item-editor.component.html',
	styleUrls: ['./item-editor.component.less']
})
export class ItemEditorComponent implements OnInit {

	editing = false;
	item: Item = {
		tags: []
	};
	tags = [];
	error;

	constructor(private inventoryService: InventoryService, private driveService: DriveService, private router: Router, private route: ActivatedRoute) { }

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
						alert(error);
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
				alert(error);
			}
		);

		this.driveService.setHost(config.fileServer);
	}

	addItem() {
		this.inventoryService.addItem(this.item).subscribe(
			(data) => {
				this.router.navigate(['/admin/inventory/' + data.item._id]);
				this.error = null;
			},
			error => {
				alert(error);
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
						alert(error);
					}
				);
			},
			error => {
				alert(error);
			}
		);
	}

	removeItem() {
		if(!confirm("¿Seguro que quieres borrar el producto?")) return;
		this.inventoryService.removeItem(this.item._id).subscribe(
			() => {
				this.router.navigate(['/admin/inventory']);
				this.error = null;
			},
			error => {
				alert(error);
			}
		);
	}

	editImage() {
		if (!confirm('¿Seguro que quieres editar la imagen?')) return;
		this.driveService.getImageFile().subscribe((data) => {
			this.item.icon = data.url;
		});
	}

}
