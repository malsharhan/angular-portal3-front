import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {GlobalVariableService} from '@app/_services';
import {EventsDataService} from '@app/shared/_services';
import {Event} from '@app/shared/_model';
import {environment} from '@environments/environment';
import {first} from 'rxjs/operators';
import consts from '@core/consts';
import ext2mime from '@core/ext2mime.json';

@Component({
  selector: 'app-shared-recent-events',
  templateUrl: './shared-recent-events.component.html',
  styleUrls: ['./shared-recent-events.component.scss']
})
export class SharedRecentEventsComponent implements OnInit{
  @Input() scope: string;
  @Input() category: string;
  title: string;

  consts = consts;

  items: Event[] = [];
  typeClasses = ['green-text', 'pink-text', 'indigo-text'];
  defaultItems: Event[] = [
    {
      type: '',
      typeClass: this.typeClasses[0],
      name: this.translate.instant('COMPANY'),
      title: this.translate.instant('COMMON.NO_DATA'),
      timestamp: '',
      description: '',
      media: `${environment.assetsBaseUrl}/images/welcome.jpg`,
      mime: 'image/jpeg',
    }
  ];

  constructor(private router: Router,
              private globalVariableService: GlobalVariableService,
              private translate: TranslateService,
              private service: EventsDataService) {
  }

  ngOnInit() {
    const {scope} = this;
    if (scope === consts.previous) {
      this.title = this.translate.instant('SHARED_EVENTS.LAST_EVENTS');
    } else if (scope === consts.upcoming) {
      this.title = this.translate.instant('SHARED_EVENTS.MOST_UPCOMING');
    }
    this.loadData();
  }

  loadData() {
    // console.log(this.category);
    const {scope, category} = this;
    const limit = consts.eventsCount.recent;
    this.service.list({scope, category, limit}).pipe(first())
      .subscribe(res => {
        if (res.result === consts.success && res.data.length > 0) {
          this.items = [];
          let extension;
          let i = 0, cnt = this.typeClasses.length;
          for (let slide of res.data) {
            extension = '.' + slide.media.split('.').pop();
            this.items.push({
              type: slide.type,
              typeClass: this.typeClasses[i++ % cnt],
              name: slide.name,
              timestamp: slide.timestamp,
              title: slide.name,
              description: slide.description,
              media: `${environment.assetsBaseUrl}${slide.media}`,
              mime: ext2mime[extension],
            });
          }
        } else {
          this.items = this.defaultItems;
        }
      }, error => {
        this.items = this.defaultItems;
      });
  }
}