import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import {Subject} from 'rxjs';
import {switchMap, takeUntil} from 'rxjs/operators';
import {AppAuthService} from '../service/app.auth.service';

@Directive({ selector: '[appIsInRole]' })
export class IsInRoleDirective implements OnInit, OnDestroy {
  private viewContainerRef = inject(ViewContainerRef);
  private templateRef = inject<TemplateRef<any>>(TemplateRef);
  private authService = inject(AppAuthService);

  @Input() appIsInRole = '';
  stop$ = new Subject();
  isVisible = false;

  ngOnInit() {
    // React on every token change so the view updates as soon as the
    // access token is available (e.g. right after login, without a reload).
    this.authService.accessTokenObservable.pipe(
      switchMap(() => this.authService.getRoles()),
      takeUntil(this.stop$)
    ).subscribe(roles => {
      if (roles && roles.includes(this.appIsInRole)) {
        if (!this.isVisible) {
          this.isVisible = true;
          this.viewContainerRef.createEmbeddedView(this.templateRef);
        }
      } else {
        this.isVisible = false;
        this.viewContainerRef.clear();
      }
    });
  }

  ngOnDestroy() {
    this.stop$.next(null);
  }
}
