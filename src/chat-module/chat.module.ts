import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { SharedModule } from '../shared.module';
import { ChatService } from './chat-service';
import { ChatPage } from './chat/chat';
import { ChatsPage } from './chats/chats';
import { ChatFooterComponent } from './chat-footer/chat-footer';
import { ChatBubbleComponent } from './chat-bubble/chat-bubble';
import { SendMessageModalComponent } from './send-message-modal/send-message-modal';

const PAGES = [
	ChatsPage,
	ChatPage
];

const MODALS = [
	SendMessageModalComponent,
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
		...MODALS,
	],
	providers: [ChatService],
	imports: [
		...getImports(),
		TranslateModule.forChild({}),
		SharedModule,
	],
	entryComponents: [
		...MODALS,
	],
	exports: PAGES
})
export class ChatModule { }
