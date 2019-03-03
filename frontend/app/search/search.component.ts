import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';

import { UtilsService } from '../utils.service';

@Component({
	selector: 'app-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.less']
})
export class SearchComponent implements OnInit, OnChanges {

	@Input() items = [];
	@Input() keys = [];
	@Output() itemsChange = new EventEmitter<any>();

	search = '';

	constructor(private utilsService: UtilsService) { }

	ngOnInit() {
	}

	ngOnChanges(changes: SimpleChanges) {
		this.filter();
	}

	filter() {
		this.itemsChange.emit(this.utilsService.filter({
			search: this.search,
			keys: this.keys,
			items: this.items,
		}));
	}

}
