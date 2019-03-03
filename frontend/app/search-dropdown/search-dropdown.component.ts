import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-search-dropdown',
	templateUrl: './search-dropdown.component.html',
	styleUrls: ['./search-dropdown.component.less']
})
export class SearchDropdownComponent implements OnInit {

	search = '';
	focused = false;

	maxWords = 5;
	@Input() words = [];
	@Output() add = new EventEmitter<any>();

	constructor() { }

	ngOnInit() {
	}

	_add() {
		this.add.emit(this.search);
		this.search = '';
	}

	get _words() {
		this.search = this.search.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
		let words = [];
		for(let word of this.words) {
			if (word.indexOf(this.search) > -1) {
				words.push(word);
			}
		}
		words = words.slice(0, this.maxWords);
		return words;
	}

	select(word) {
		console.log('word: ', word)
		this.search = word;
	}

}
