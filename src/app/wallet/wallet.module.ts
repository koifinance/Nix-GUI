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
import { UpdatesComponent } from './updates/updates.component';
import { DownloadingUpdateComponent } from './updates/downloading-update/downloading-update.component';
import { OutOfDateComponent } from './updates/out-of-date/out-of-date.component';
import { GhostNodeComponent } from './multinodes/table/ghost-node/ghost-node.component';
import { SettingComponent } from './setting/setting/setting.component';
import { PreferencesComponent } from './setting/setting/preference/preferences/preferences.component';
import { SecurityComponent } from './setting/setting/preference/security/security.component';
import { AdressbookComponent } from './setting/setting/preference/adressbook/adressbook.component';
import { NetworkComponent } from './setting/setting/preference/network/network.component';
import { AboutNixComponent } from './about-nix/about-nix.component';
import { HelpComponent } from './help/help.component';
import { NixPriceChartComponent } from './overview/nix-price-chart/nix-price-chart.component';

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
	  UpdatesComponent,
    DownloadingUpdateComponent,
    OutOfDateComponent,
    GhostNodeComponent,
    SettingComponent,
    PreferencesComponent,
    SecurityComponent,
    AdressbookComponent,
    NetworkComponent,
    AboutNixComponent,
    HelpComponent,
    NixPriceChartComponent,
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
