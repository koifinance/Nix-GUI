import { ModuleWithProviders } from '@angular/core';
/* Preload strategry */
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
/* end preload strategy */

/* actual routing */
const routes: Routes = [
  { path: '', redirectTo: 'wallet', pathMatch: 'full' },
  { path: 'wallet', loadChildren: './wallet/wallet.module#WalletModule' }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules});

