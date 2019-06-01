import { NgModule } from '@angular/core';

import { ImagePipe } from './pipes/image/image';
import { TimePipe } from './pipes/time/time';
import { TimeAgoPipe } from './pipes/time/time-ago';
import { LocalImagePipe } from './pipes/image/localImage';
import { TranslateModule } from '@ngx-translate/core';
import { AutoResize } from './directives/auto-resize';
import { LoaderComponent } from './components/loader/loader';
import { EmptyPlaceholderComponent } from './components/empty-placeholder/empty-placeholder';
import { InlineSVGModule } from 'ng-inline-svg';
import { CommonModule } from '@angular/common';

const PIPES = [ImagePipe, TimePipe, TimeAgoPipe, LocalImagePipe];
const DIRECTIVES = [AutoResize];
const COMPONENTS = [LoaderComponent, EmptyPlaceholderComponent];
@NgModule({
	declarations: [...PIPES, ...DIRECTIVES, ...COMPONENTS],
	imports: [TranslateModule.forChild({}), InlineSVGModule, CommonModule],
	exports:  [...PIPES, ...DIRECTIVES, ...COMPONENTS]
})
export class SharedModule {}
