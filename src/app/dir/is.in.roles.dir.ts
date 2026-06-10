import { Directive, inject, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { AppAuthService } from '../service/app.auth.service';

@Directive({ selector: '[appIsInRoles]' })
export class IsInRolesDirective implements OnInit, OnDestroy {
  @Input() appIsInRoles?: string[];
  stop$ = new Subject();
  isVisible = false;

  private viewContainerRef = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef<any>);
  private authService = inject(AppAuthService);

  constructor() { }

  ngOnInit() {
    this.authService.accessTokenObservable.pipe(
      switchMap(() => this.authService.getRoles()),
      takeUntil(this.stop$)
    ).subscribe(roles => {
      let found = true;
      this.appIsInRoles?.forEach(r => {
        if (!roles.includes(r)) {
          found = false;
        }
      });
      if (found) {
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
