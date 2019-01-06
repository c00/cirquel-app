import { NgModule } from '@angular/core';
import { SubsBannerComponent } from './subs-banner/subs-banner';
import { AvatarComponent } from './avatar/avatar';
@NgModule({
	declarations: [SubsBannerComponent,
    AvatarComponent],
	imports: [],
	exports: [SubsBannerComponent,
    AvatarComponent]
})
export class ComponentsModule {}
