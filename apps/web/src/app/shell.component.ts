import { NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { TuiRoot } from '@taiga-ui/core';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIf, NgForOf, TuiRoot],
  template: `
    <tui-root>
      <div class="app-shell">
        <header class="app-header shadow-sm">
          <div class="brand">
            <span class="brand-logo">Mini PDV</span>
          </div>
          <nav class="app-nav">
            <a
              routerLink="/produtos"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: true }"
            >
              Produtos
            </a>
            <a routerLink="/estoque/entrada" routerLinkActive="active">Estoque</a>
            <a routerLink="/vendas/nova" routerLinkActive="active">Vendas</a>
          </nav>
          <div class="avatar" aria-label="Perfil">
            <span>VP</span>
          </div>
        </header>

        <section class="breadcrumbs" *ngIf="breadcrumbs.length">
          <span *ngFor="let crumb of breadcrumbs; let last = last" class="crumb">
            <span>{{ crumb }}</span>
            <span class="divider" *ngIf="!last">/</span>
          </span>
        </section>

        <main class="content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </tui-root>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
        background: var(--bg);
        color: var(--text);
      }

      .app-shell {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }

      .app-header {
        position: sticky;
        top: 0;
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 2rem;
        background: #ffffff;
        border-bottom: 1px solid rgba(15, 23, 42, 0.08);
      }

      .brand-logo {
        font-weight: 700;
        font-size: 1.125rem;
        letter-spacing: 0.02em;
        color: var(--primary);
      }

      .app-nav {
        display: flex;
        gap: 1.5rem;
      }

      .app-nav a {
        font-weight: 500;
        color: rgba(15, 23, 42, 0.7);
        text-decoration: none;
        transition: color 0.2s ease;
      }

      .app-nav a:hover,
      .app-nav a.active {
        color: var(--primary);
      }

      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 999px;
        background: rgba(37, 99, 235, 0.12);
        color: var(--primary);
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .breadcrumbs {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 2rem;
        font-size: 0.875rem;
        color: rgba(15, 23, 42, 0.6);
      }

      .crumb {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        text-transform: capitalize;
      }

      .divider {
        color: rgba(15, 23, 42, 0.3);
      }

      .content {
        flex: 1;
        padding: 2rem;
        background: var(--bg);
      }

      @media (max-width: 960px) {
        .app-header {
          padding: 0.75rem 1.5rem;
        }

        .app-nav {
          gap: 1rem;
        }

        .content {
          padding: 1.5rem;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
  private readonly router = inject(Router);

  breadcrumbs: string[] = [];

  constructor() {
    this.updateBreadcrumbs(this.router.url);

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((event) => {
        this.updateBreadcrumbs(event.urlAfterRedirects);
      });
  }

  private updateBreadcrumbs(url: string): void {
    const segments = url
      .split('?')[0]
      .split('#')[0]
      .split('/')
      .filter((segment) => segment.length > 0);

    this.breadcrumbs = segments.map((segment) =>
      segment
        .replace(/-/g, ' ')
        .replace(/:|%3A/g, '')
        .replace(/\b\w/g, (char) => char.toUpperCase()),
    );
  }
}
