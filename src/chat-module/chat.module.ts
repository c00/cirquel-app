import { NgModule } from '@angular/core';
import { ChatService } from './chat-service';
import { ChatsPage } from './chats/chats';
import { ChatPage } from './chat/chat';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { ImagePipe } from '../pipes/image/image';
import { PipesModule } from '../pipes/pipes.module';

const PAGES = [
	ChatsPage, 
	ChatPage
];

function getImports() {
	const modules = [];
	for (let p of PAGES) {
		modules.push(IonicPageModule.forChild(p));
	}
	return modules;
}

@NgModule({
	declarations: PAGES,
	providers: [ChatService],
	imports: [
		...getImports(),
		TranslateModule.forChild({}),
		PipesModule,
	],
	exports: PAGES
})
export class ChatModule {}
