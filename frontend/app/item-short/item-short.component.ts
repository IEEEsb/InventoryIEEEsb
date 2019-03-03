import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Item } from '../../../models/Item';

@Component({
	selector: 'app-item-short',
	templateUrl: './item-short.component.html',
	styleUrls: ['./item-short.component.less']
})
export class ItemShortComponent implements OnInit {

	@Input() item: any;
	@Input() type: String;
	@Output() transaction = new EventEmitter<any>();
	@Output() remove = new EventEmitter();
	@Output() view = new EventEmitter();

	quantity = 1;

	constructor() { }

	ngOnInit() {
	}

	_transaction() {
		this.transaction.emit(this.quantity);
		this.quantity = 1;
	}

	_remove() {
		this.remove.emit();
	}

	_view() {
		this.view.emit();
	}

}
