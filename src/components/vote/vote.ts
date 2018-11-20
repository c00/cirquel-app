import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'vote',
  templateUrl: 'vote.html'
})
export class VoteComponent {
  options: VoteOptions;
  vote = 3;
  presets = {
    skill: { text: 'item.skill-question', iconLeft: 'custom-skill-low', iconRight: 'custom-skill-high', okButton: 'vote.vote' },
    strength: { text: 'item.strength-question', iconLeft: 'custom-strength-low', iconRight: 'custom-strength-high', okButton: 'vote.vote' },
    flexi: { text: 'item.flexi-question', iconLeft: 'custom-flex-low', iconRight: 'custom-flex-high', okButton: 'vote.vote' }
  };
  
  @Input() type: string;
  @Output('onVote') voteEvent = new EventEmitter<number>();
  @Output('onDismiss') dismissEvent = new EventEmitter<void>();

  constructor() {
    
  }
  
  public ngOnInit() {
    this.options = this.presets[this.type];
  }

  public doVote() {
    this.voteEvent.emit(this.vote);
  }

  public dismiss() {
    this.dismissEvent.emit();
  }
  
}

export interface VoteOptions {
  text?: string;
  vote?: number;
  okButton?: string;
  iconLeft?: string;
  iconRight?: string;
}
