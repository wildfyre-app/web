import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  template: `
  <h1 md-dialog-title>Are you sure you want to logout?</h1>
  <div md-dialog-actions>
    <button md-button md-dialog-close="true" (click)="returnInformation(true)">Yes</button>
    <button md-button md-dialog-close="false" (click)="returnInformation(false)">Cancel</button>
  </div>
  `
})
export class LogoutDialogComponent {
  model: any = {};

  constructor(
    public dialogRef: MdDialogRef<LogoutDialogComponent>
    ) { }

    returnInformation(bool: boolean) {
      const message = {
        'bool': bool
      };

      this.dialogRef.close(message);
    }
}
