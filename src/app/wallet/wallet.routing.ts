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
import { MultinodesComponent } from './multinodes/multinodes.component';
import { RewardHistoryChartComponent } from './reward-history-chart/reward-history-chart.component';
import { RewardHistoryTableComponent } from './reward-history-table/reward-history-table.component';
import { SettingComponent } from './setting/setting/setting.component';
// import { SettingsComponent } from './settings/settings.component';
import { UpdatesComponent } from './updates/updates.component';
import { DownloadingUpdateComponent } from './updates/downloading-update/downloading-update.component';
import { OutOfDateComponent } from './updates/out-of-date/out-of-date.component';
import { AboutNixComponent } from './about-nix/about-nix.component';
import { HelpComponent } from './help/help.component';
import { NixPriceChartComponent } from './overview/nix-price-chart/nix-price-chart.component';

const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: 'welcome', component: WelcomeComponent, data: { title: 'Welcome', page: 'welcome' } },
  { path: 'create', component: CreateComponent, data: { title: 'Create', page: 'create' } },
  { path: 'restore', component: RestoreComponent, data: { title: 'Restore', page: 'restore' } },
  { path: 'reward-history-table', component: RewardHistoryTableComponent, data: { title: 'Ghost Nodes reward history', page: 'reward-history-table' } },
  { path: 'reward-history-chart', component: RewardHistoryChartComponent, data: { title: 'Ghost Nodes reward history', page: 'reward-history-chart' } },
  { path: 'overview/nix-price-chart', component: NixPriceChartComponent, data: { title: 'NIX price chart', page: 'nix-price-chart' } },
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
      { path: 'ghost', component: NodesComponent, data: { title: 'Ghost Nodes', page: 'ghost' } },
      { path: 'multi/nodes', component: MultinodesComponent, data: { title: 'Muliti  Nodes', page: 'mulitinodes' } },
      { path: 'settings', component: SettingComponent, data: { title: 'Settings' } },
      { path: 'updates', component: UpdatesComponent, data: { title: 'Updates', page: 'updates' } },
      { path: 'downloading-updates', component: DownloadingUpdateComponent, data: { title: 'Downloading Updates', page: 'downloading-updates' } },
      { path: 'updates/out-of-date', component: OutOfDateComponent, data: { title: 'Out Of Date Update', page: 'out-of-date' } },
      { path: 'about-NIX', component: AboutNixComponent, data: { title: 'About Nix', page: 'about-nix' } },
      { path: 'help', component: HelpComponent, data: { title: 'Help', page: 'help' } },
    ]
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
