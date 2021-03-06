import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {Title} from '@angular/platform-browser';
import {AuthenticationService, GlobalVariableService} from '@app/_services';
import consts from '@core/consts';
import {User} from '@app/_models';

@Component({
  selector: 'app-human-front',
  templateUrl: './human-front.component.html',
  styleUrls: ['./human-front.component.scss']
})
export class HumanFrontComponent implements OnInit{
  consts = consts;

  currentUser: User;

  constructor(private router: Router,
              private title: Title,
              private globalVariableService: GlobalVariableService,
              private translate: TranslateService,
              private authService: AuthenticationService,) {
  }

  ngOnInit() {
    this.title.setTitle(this.translate.instant('HOME_FRONT.HUMAN_CAPITAL') + ' - ' + this.translate.instant('SITE_NAME'));
    this.globalVariableService.getLanguage()
      .subscribe(data => {
        this.title.setTitle(this.translate.instant('HOME_FRONT.HUMAN_CAPITAL') + ' - ' + this.translate.instant('SITE_NAME'));
      });
    this.currentUser = this.authService.currentUserValue;
  }
}
