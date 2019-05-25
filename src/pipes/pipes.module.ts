import { NgModule } from '@angular/core';

import { ImagePipe } from './image/image';
import { TimePipe } from './time/time';
import { TimeAgoPipe } from './time/time-ago';
import { LocalImagePipe } from './image/localImage';
import { TranslateModule } from '@ngx-translate/core';

const PIPES = [ImagePipe, TimePipe, TimeAgoPipe, LocalImagePipe];
@NgModule({
	declarations: PIPES,
	imports: [TranslateModule.forChild({})],
	exports: PIPES
})
export class PipesModule {}
