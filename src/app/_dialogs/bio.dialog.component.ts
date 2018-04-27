import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  template: `
  <h1 md-dialog-title>Change Bio</h1>
    <md-input-container>
      <textarea mdInput rows="10" cols="80" type="text" class="form-control" name="bio" [(ngModel)]="model.bio" #bio="ngModel"></textarea>
    </md-input-container>
  <div md-dialog-actions>
    <button md-button md-dialog-close="true" (click)="returnInformation(true)">Change Bio</button>
    <button md-button md-dialog-close="false" (click)="returnInformation(false)">Cancel</button>
  </div>
  `
})
export class BioDialogComponent {
  model: any = {};

  constructor(
    public dialogRef: MdDialogRef<BioDialogComponent>
    ) { }

    returnInformation(bool: boolean) {
      const message = {
        'bio': this.model.bio,
        'bool': bool
      };

      this.dialogRef.close(message);
    }
}
