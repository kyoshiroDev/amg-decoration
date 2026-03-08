import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'cms-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
})
export class AdminLayoutComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly isSidebarOpen = signal(true);

  readonly navItems: NavItem[] = [
    { path: '/', label: 'Dashboard', icon: '⊞' },
    { path: '/projets', label: 'Projets', icon: '◻' },
    { path: '/prestations', label: 'Prestations', icon: '◈' },
    { path: '/temoignages', label: 'Témoignages', icon: '◎' },
  ];

  readonly userEmail = this.auth.currentUser;

  toggleSidebar(): void {
    this.isSidebarOpen.update(v => !v);
  }

  logout(): void {
    this.auth.logout();
  }

  get currentRoute(): string {
    return this.router.url;
  }
}
