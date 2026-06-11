import { Component, inject, OnInit, signal } from '@angular/core';
import {AppAuthService} from './service/app.auth.service';
import {OAuthService} from 'angular-oauth2-oidc';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { DateAdapter } from '@angular/material/core';
import { MatButton, MatAnchor } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { IsInRoleDirective } from './dir/is.in.role.dir';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [MatToolbar, MatIcon, MatButton, MatAnchor, AppHeaderComponent, IsInRoleDirective, RouterLink, RouterLinkActive, RouterOutlet, TranslateModule]
})
export class AppComponent implements OnInit {
  private authService = inject(AppAuthService);
  private dateAdapter = inject<DateAdapter<any>>(DateAdapter);
  private translate = inject(TranslateService);
  oauthService = inject(OAuthService);
  useralias = signal('');

  public constructor() {
    this.translate.addLangs(['de_CH']);
    this.translate.use('de_CH');
    this.dateAdapter.setLocale('de-CH');
  }

  ngOnInit(): void {
    this.authService.useraliasObservable.subscribe(alias => {
      this.useralias.set(alias);
    });
  }

  logout() {
    this.authService.logout();
  }
}
