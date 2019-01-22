import { Component, ViewChild, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { ImageCropperComponent, CropperSettings, Bounds } from 'ngx-img-cropper';

@Component({
  template: `
  <h1 mat-dialog-title>Upload Your Picture</h1>

  <img-cropper [image]="data" [settings]="cropperSettings" (onCrop)="cropped($event)"></img-cropper>
  <span class="result" *ngIf="data.image">
    <img [src]="data.image" [width]="croppedWidth" [height]="croppedHeight">
  </span>

  <div mat-dialog-actions>
    <button mat-button mat-dialog-close="true" (click)="returnInformation(true)">Add image</button>
    <button mat-button mat-dialog-close="false" (click)="returnInformation(false)">Cancel</button>
  </div>
  `
})
export class PictureDialogComponent implements OnInit {
  @ViewChild('cropper', undefined) cropper: ImageCropperComponent;
  comment: boolean;
  croppedHeight: number;
  croppedWidth: number;
  cropperSettings: CropperSettings;
  data: any;
  model: any = {};
  picture: any;

  constructor(
    public dialogRef: MatDialogRef<PictureDialogComponent>,
    public snackBar: MatSnackBar
    ) {
      this.cropperSettings = new CropperSettings();
      this.cropperSettings.width = 920;
      this.cropperSettings.height = 580;

      this.cropperSettings.canvasWidth = 300;
      this.cropperSettings.canvasHeight = 200;

      this.cropperSettings.minWidth = 10;
      this.cropperSettings.minHeight = 10;

      this.cropperSettings.rounded = false;
      this.cropperSettings.keepAspect = false;

      this.cropperSettings.cropperDrawSettings.strokeColor = 'rgb(191, 63, 127)';
      this.cropperSettings.cropperDrawSettings.strokeWidth = 3;

      // touch
      this.cropperSettings.touchRadius = 60;
      this.cropperSettings.centerTouchRadius = 60;
      this.cropperSettings.markerSizeMultiplier = 3;
      this.cropperSettings.showCenterMarker = true;

      // resulting output image size / quality (500x500px with 80% quality == ~45k jpeg)
      this.cropperSettings.croppedWidth = 500;
      this.cropperSettings.croppedHeight = 500;
      this.cropperSettings.compressRatio = 0.8;
      this.cropperSettings.preserveSize = false; // false: use croppedWidth, croppedHeight
      this.cropperSettings.minWithRelativeToResolution = true;

      this.data = {};
    }

    ngOnInit() {
      if (this.comment) {
        this.cropperSettings.croppedWidth =	800;
        this.cropperSettings.croppedHeight = 600;
      }
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
        this.picture = new Blob([ab], {'type': mimeString });
        this.picture['name'] = 'imageFile';
        switch (this.picture.type) {
          case 'image/jpeg':
            this.picture['name'] += '.jpg';
          break;
          case 'image/png':
            this.picture['name'] += '.png';
          break;
        }
      } else {
        this.snackBar.open('You did not select a valid image file', 'Close', {
          duration: 3000
        });
      }
    }

    returnInformation(bool: boolean) {
      const message = {
        'picture': this.picture,
        'bool': bool
      };

      this.dialogRef.close(message);
    }
}
