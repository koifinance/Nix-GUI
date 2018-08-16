import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { ModalsModule } from './modals/modals.module';
import { SharedModule } from './shared/shared.module';

import { routing } from './wallet.routing';

import { FilterService } from './transactions/filter.service';

import { MainComponent } from './main/main.component';
import { OverviewComponent } from './overview/overview.component';
import { VaultComponent } from './vault/vault.component';
import { NodesComponent } from './nodes/node.component';
import { TransactionsComponent } from './transactions/transaction.component';
import { CreateComponent } from './create/create.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { RestoreComponent } from './restore/restore.component';
import { GhostComponent } from './ghost/ghost.component';
import { MultinodesComponent } from './multinodes/multinodes.component';
import { RewardHistoryTableComponent } from './reward-history-table/reward-history-table.component';
import { RewardHistoryChartComponent } from './reward-history-chart/reward-history-chart.component';

@NgModule({
  declarations: [
    CreateComponent,
    MainComponent,
    OverviewComponent,
    NodesComponent,
    RestoreComponent,
    TransactionsComponent,
    VaultComponent,
    WelcomeComponent,
    GhostComponent,
	MultinodesComponent,
    RewardHistoryTableComponent,
    RewardHistoryChartComponent,
  ],
  imports: [
    ModalsModule,
    routing,
    SharedModule,
  ],
  exports: [
    MainComponent,
    WelcomeComponent,
  ],
  providers: [FilterService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class WalletModule {
  constructor() {
  }
}
