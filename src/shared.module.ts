import { NgModule } from '@angular/core';

import { ImagePipe } from './pipes/image/image';
import { TimePipe } from './pipes/time/time';
import { TimeAgoPipe } from './pipes/time/time-ago';
import { LocalImagePipe } from './pipes/image/localImage';
import { TranslateModule } from '@ngx-translate/core';
import { AutoResize } from './directives/auto-resize';

const PIPES = [ImagePipe, TimePipe, TimeAgoPipe, LocalImagePipe];
const DIRECTIVES = [AutoResize];
@NgModule({
	declarations: [...PIPES, ...DIRECTIVES],
	imports: [TranslateModule.forChild({})],
	exports:  [...PIPES, ...DIRECTIVES]
})
export class SharedModule {}
