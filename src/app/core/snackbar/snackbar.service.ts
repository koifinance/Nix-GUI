import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { NotificationsService } from 'angular2-notifications';

@Injectable()
export class SnackbarService {

  constructor(
    private snackBar: MatSnackBar,
    private notificationsService: NotificationsService
  ) {
  }

  open(message: string, type?: string, action?: string): void {
    const config = new MatSnackBarConfig();

    config.duration = (
      ['err', 'warn'].includes(type) ? 10000 :
      'info' === type ? 5000 : 2000);

    // this.snackBar.open(message, action ? action : 'Dismiss', config);
    // if (type == 'err') this.notificationsService.error('Error', message)
    if (type == 'err') this.notificationsService.warn('Warning', message)
    else if (type == 'info') this.notificationsService.info('Info', message)
  }

}
