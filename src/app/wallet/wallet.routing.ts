import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateComponent } from './create/create.component';
import { MainComponent } from './main/main.component';
import { NodesComponent } from './nodes/node.component';
import { OverviewComponent } from './overview/overview.component';
import { RestoreComponent } from './restore/restore.component';
import { TransactionsComponent } from './transactions/transaction.component';
import { VaultComponent } from './vault/vault.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { GhostComponent } from './ghost/ghost.component';
// import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: 'welcome', component: WelcomeComponent, data: { title: 'Welcome', page: 'welcome' } },
  { path: 'create', component: CreateComponent, data: { title: 'Create', page: 'create' } },
  { path: 'restore', component: RestoreComponent, data: { title: 'Restore', page: 'restore' } },
  {
    path: 'main',
    component: MainComponent,
    data: { title: 'Main', page: 'main' },
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: OverviewComponent, data: { title: 'Overview', page: 'overview' } },
      { path: 'vault', component: VaultComponent, data: { title: 'Ghost Vault', page: 'vault' } },
      { path: 'transactions', component: TransactionsComponent, data: { title: 'Transaction History', page: 'transactions' } },
      { path: 'nodes', component: GhostComponent, data: { title: 'Ghost Nodes', page: 'nodes' } },
      { path: 'ghost', component: NodesComponent, data: { title: 'Ghost Nodes', page: 'nodes' } },

      // { path: 'settings', component: SettingsComponent, data: { title: 'Settings' } },
    ]
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
