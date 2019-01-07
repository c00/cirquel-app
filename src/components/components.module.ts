import { NgModule } from '@angular/core';
import { SubsBannerComponent } from './subs-banner/subs-banner';
import { AvatarComponent } from './avatar/avatar';
import { FollowButtonComponent } from './follow-button/follow-button';
@NgModule({
	declarations: [SubsBannerComponent,
    AvatarComponent,
    FollowButtonComponent],
	imports: [],
	exports: [SubsBannerComponent,
    AvatarComponent,
    FollowButtonComponent]
})
export class ComponentsModule {}
