import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { Choice } from '../_models/choice';
import { AreaService } from '../_services/area.service';
import { ReasonService } from '../_services/reason.service';

enum TypeOfReport {
  Post,
  Comment
}

@Component({
  template: `
  <h1 md-dialog-title>Please choose a flag reason:</h1>

  <div md-dialog-actions>
    <md-radio-group class="radio-group" [(ngModel)]="clickedChoice">
      <md-radio-button class="example-radio-button" *ngFor="let choice of flagChoices" [value]="choice.key">
        {{choice.value}}
        <br>
      </md-radio-button>
    </md-radio-group>

    <md-input-container>
      <textarea mdInput name="comment" rows="3" cols="40" type="text" name="report"
      [(ngModel)]="model.report" #report="ngModel" placeholder="Explain what is wrong.."></textarea>
    </md-input-container>
  </div>
  <br>
  <div md-dialog-actions>
    <button md-button md-dialog-close="true" (click)="sendReport()">Ok</button>
    <button md-button md-dialog-close="false">Cancel</button>
  </div>
  `
})
export class FlagDialogComponent {
  flagChoices: Choice[] = [];
  clickedChoice: string;
  model: any = {};
  typeOfReport: TypeOfReport;

  constructor(
    public dialogRef: MdDialogRef<FlagDialogComponent>,
    private reasonService: ReasonService,
    private areaService: AreaService
    ) {

      if (this.reasonService.flagChoices.length === 0) {
        this.reasonService.getFlagReasons()
          .subscribe( (choices: Choice[]) => {
            this.flagChoices = choices;
            this.reasonService.flagChoices = choices;
        });
      } else {
        this.flagChoices = this.reasonService.flagChoices;
      }
    }

    sendReport() {
      const message = {
        'typeOfReport': this.typeOfReport,
        'report': this.model.report,
        'choice': this.clickedChoice,
        'area': this.areaService.currentAreaName
      };

      this.dialogRef.close(message);
  }
}
