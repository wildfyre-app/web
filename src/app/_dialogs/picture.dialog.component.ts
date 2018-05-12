import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  template: `
  <h1 md-dialog-title>Enter in the picture information</h1>

    <div md-dialog-actions>
      <md-input-container>
        <input mdInput name="comment" type="text" name="url"
        [(ngModel)]="model.url" #url="ngModel" placeholder="Url of picture, must start with https">
      </md-input-container>
      <md-input-container>
        <input mdInput name="comment" type="text" name="description"
        [(ngModel)]="model.description" #description="ngModel" placeholder="Describe your picture">
      </md-input-container>
      <md-input-container>
        <input mdInput name="comment" type="text" name="altText"
        [(ngModel)]="model.altText" #altText="ngModel" placeholder="Alt text if the picture gets removed">
      </md-input-container>
    </div>

  <div md-dialog-actions>
    <button md-button md-dialog-close="true" (click)="sendPictureInformation()">Ok</button>
    <button md-button md-dialog-close="false">Cancel</button>
  </div>
  `
})
export class PictureDialogComponent {
  model: any = {};
  constructor(
    public dialogRef: MdDialogRef<PictureDialogComponent>
    ) { }

    sendPictureInformation() {
      const message = {
        'url': this.model.url,
        'description' : this.model.description,
        'altText' : this.model.altText
      };

      this.dialogRef.close(message);
    }
}
