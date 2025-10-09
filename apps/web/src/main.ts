import { provideHttpClient } from "@angular/common/http";
import { Sanitizer } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter } from "@angular/router";
import { provideEventPlugins } from "@taiga-ui/event-plugins";
import { NgDompurifySanitizer } from "@tinkoff/ng-dompurify";

import { appRoutes } from "./app/app.routes";
import { TUI_SANITIZER } from "./app/core/tui-sanitizer.token";
import { ShellComponent } from "./app/shell.component";

bootstrapApplication(ShellComponent, {
  providers: [
    provideAnimations(),
    provideHttpClient(),
    provideEventPlugins(),
    { provide: Sanitizer, useClass: NgDompurifySanitizer },
    { provide: TUI_SANITIZER, useExisting: Sanitizer },
    provideRouter(appRoutes),
  ],
}).catch((err) => console.error(err));
