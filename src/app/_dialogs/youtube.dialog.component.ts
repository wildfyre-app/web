import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  template: `
  <h1 md-dialog-title>Enter in the YouTube information</h1>

    <div md-dialog-actions>
      <md-input-container>
        <input mdInput name="comment" type="text" name="url"
        [(ngModel)]="model.url" #url="ngModel" placeholder="Url of full youtube link">
      </md-input-container>
      <md-input-container>
        <input mdInput name="comment" type="text" name="altText"
        [(ngModel)]="model.altText" #altText="ngModel" placeholder="Alt text if the video gets removed">
      </md-input-container>
    </div>
    <br>
  <div md-dialog-actions>
    <button md-button md-dialog-close="true" (click)="sendYouTubeInformation()">Ok</button>
    <button md-button md-dialog-close="false">Cancel</button>
  </div>
  `
})
export class YouTubeDialogComponent {
  model: any = {};
  constructor(
    public dialogRef: MdDialogRef<YouTubeDialogComponent>
    ) { }

    sendYouTubeInformation() {
      const message = {
        'url': this.model.url,
        'altText' : this.model.altText
      };

      this.dialogRef.close(message);
    }
}
