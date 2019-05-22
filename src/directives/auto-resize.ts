import { Directive, ElementRef, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Content } from 'ionic-angular';


@Directive({
	selector: "[autoResize]" // Attribute selector
})
export class AutoResize implements OnChanges {
	@Input('content') content?: Content;
	@Input('autoResize') watchValue?: any;
	
	@HostListener("input", ["$event.target"])
	onInput(ta: HTMLTextAreaElement) {
		this.adjust('input');
	}

	//We can either watch the input for changes, or watch the "watchValue".
	private mode = 'input';
	private ta: any;
	private lastHeight = 0;

	constructor(public el: ElementRef) { }

	public ngOnInit() {
		setTimeout(() => this.adjust('input'), 0);
	}

	public ngOnChanges(change: SimpleChanges) {
		if (!change.watchValue) return;
		//If any change ever occurs in the watch value, it means we have a watch value.
		this.mode = 'value';
		if (change.watchValue.currentValue !== change.watchValue.previousValue) {
			setTimeout(() => this.adjust('value'), 0);
		}		
	}

	private setTa() {
		if (this.el.nativeElement.type === 'textarea') {
			this.ta = this.el.nativeElement;
		} else {
			this.ta = this.el.nativeElement.getElementsByTagName('textarea')[0];
		}
	}

	public adjust(changeFrom: string) {
		//Trigger only the correct 'mode'
		if (changeFrom !== this.mode) return;

		if (!this.ta) this.setTa();

		const minHeight = 12;
		const maxHeight = 72;
		
		if (this.ta === null || this.ta === undefined) return;
		this.ta.style.overflow = "hidden";
		this.ta.style.height = "auto";
		let newHeight = this.ta.scrollHeight;

		if (newHeight < minHeight) newHeight = minHeight;
		if (newHeight > maxHeight) newHeight = maxHeight;

		this.ta.style.height = newHeight + "px";

		if (newHeight == this.lastHeight) return;
		this.lastHeight = newHeight;
		if (this.content) this.content.resize();
	}
	
}