import { Sanitizer } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';

import { appRoutes } from './app/app.routes';
import { ShellComponent } from './app/shell.component';
import { TUI_SANITIZER } from './app/core/tui-sanitizer.token';

bootstrapApplication(ShellComponent, {
  providers: [
    provideAnimations(),
    { provide: Sanitizer, useClass: NgDompurifySanitizer },
    { provide: TUI_SANITIZER, useExisting: Sanitizer },
    provideRouter(appRoutes),
  ],
}).catch((err) => console.error(err));
