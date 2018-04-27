import { Component, ViewChild } from '@angular/core';
import { MdDialogRef, MdSnackBar } from '@angular/material';
import { Author } from '../_models/author';
import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';

@Component({
  template: `
  <h1 md-dialog-title>Change Avatar</h1>
  <img-cropper [image]="data" [settings]="cropperSettings" (onCrop)="cropped($event)"></img-cropper>
  <span class="result" *ngIf="data.image">
    <img [src]="data.image" [width]="croppedWidth" [height]="croppedHeight">
  </span>
  <div md-dialog-actions>
    <button md-button md-dialog-close="true" (click)="returnInformation(true)">Change Avatar</button>
    <button md-button md-dialog-close="false" (click)="returnInformation(false)">Cancel</button>
  </div>
  `
})
export class AvatarDialogComponent {
  @ViewChild('cropper', undefined) cropper: ImageCropperComponent;
  author: Author;
  croppedHeight: number;
  croppedWidth: number;
  cropperSettings: CropperSettings;
  data: any;
  model: any = {};
  profilePicture: any;

  constructor(
    public dialogRef: MdDialogRef<AvatarDialogComponent>,
    public snackBar: MdSnackBar
    ) {
      this.cropperSettings = new CropperSettings();
      this.cropperSettings.width = 200;
      this.cropperSettings.height = 200;

      this.cropperSettings.croppedWidth = 200;
      this.cropperSettings.croppedHeight = 200;

      this.cropperSettings.canvasWidth = 200;
      this.cropperSettings.canvasHeight = 200;

      this.cropperSettings.minWidth = 10;
      this.cropperSettings.minHeight = 10;

      this.cropperSettings.rounded = false;
      this.cropperSettings.keepAspect = true;

      this.cropperSettings.cropperDrawSettings.strokeColor = 'rgb(191, 63, 127)';
      this.cropperSettings.cropperDrawSettings.strokeWidth = 3;

      this.data = {};
    }

    cropped(bounds: Bounds) {
      this.croppedHeight = bounds.bottom - bounds.top;
      this.croppedWidth = bounds.right - bounds.left;
      if (this.data) {
        // convert the data URL to a byte string
        const byteString = atob(this.data.image.split(',')[1]);

        // pull out the mime type from the data URL
        const mimeString = this.data.image.split(',')[0].split(':')[1].split(';')[0];

        // Convert to byte array
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        // Create a blob that looks like a file.
        this.profilePicture = new Blob([ab], {'type': mimeString });
        this.profilePicture['name'] = this.author.name;
        switch (this.profilePicture.type) {
          case 'image/jpeg':
            this.profilePicture['name'] += '.jpg';
          break;
          case 'image/png':
            this.profilePicture['name'] += '.png';
          break;
        }
      } else {
        const snackBarRef = this.snackBar.open('You did not select a valid image file', 'Close', {
          duration: 3000
        });
      }
    }

    returnInformation(bool: boolean) {
      const message = {
        'profilePicture': this.profilePicture,
        'bool': bool
      };

      this.dialogRef.close(message);
    }
}
