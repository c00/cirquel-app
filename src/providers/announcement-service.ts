import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Announcement } from '../model/Announcement';
import { ApiProvider } from './api';

@Injectable()
export class AnnouncementService {
  announcements: Announcement[] = [];
  public newAnnouncement = new BehaviorSubject<Announcement>(null);

  constructor(
    private api: ApiProvider,
  ) {

  }

  public processAnouncements(announcements: Announcement[]) {
    this.announcements = announcements;

    if(announcements[0]) this.newAnnouncement.next(announcements[0]);
  }

  public markAsRead(a: Announcement) {
    return this.api.put('u/announcement', { id: a.id, read: + new Date() });
  }

}