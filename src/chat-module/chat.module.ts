import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { SharedModule } from '../shared.module';
import { ChatService } from './chat-service';
import { ChatPage } from './chat/chat';
import { ChatsPage } from './chats/chats';
import { ChatFooterComponent } from './chat-footer/chat-footer';
import { ChatBubbleComponent } from './chat-bubble/chat-bubble';

const PAGES = [
	ChatsPage,
	ChatPage
];

const COMPONENTS = [
	ChatFooterComponent,
	ChatBubbleComponent,
];

function getImports() {
	const modules = [];
	for (let p of PAGES) {
		modules.push(IonicPageModule.forChild(p));
	}
	return modules;
}

@NgModule({
	declarations: [
		...PAGES,
		...COMPONENTS,
	],
	providers: [ChatService],
	imports: [
		...getImports(),
		TranslateModule.forChild({}),
		SharedModule,
	],
	exports: PAGES
})
export class ChatModule { }
