import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  template: `
  <h1 md-dialog-title>Change Email</h1>
    <md-input-container>
      <input mdInput type="text" name="email" [(ngModel)]="model.email" #email="ngModel">
    </md-input-container>
  <div md-dialog-actions>
    <button md-button md-dialog-close="true" (click)="returnInformation(true)">Change Email</button>
    <button md-button md-dialog-close="false" (click)="returnInformation(false)">Cancel</button>
  </div>
  `
})
export class EmailDialogComponent {
  model: any = {};

  constructor(
    public dialogRef: MdDialogRef<EmailDialogComponent>
    ) { }

    returnInformation(bool: boolean) {
      const message = {
        'email': this.model.email,
        'bool': bool
      };

      this.dialogRef.close(message);
    }
}
