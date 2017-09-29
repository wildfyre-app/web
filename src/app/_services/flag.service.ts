import { Injectable, Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { MdSnackBar, MdDialog, MdDialogRef } from '@angular/material';
import { AreaService } from './area.service';
import { Choice } from '../_models/choice';
import { Comment } from '../_models/comment';
import { HttpService } from './http.service';
import { Post } from '../_models/post';
import { ReasonService } from './reason.service';

@Injectable()
export class FlagService {
  public currentComment: Comment;
  public currentPost: Post;

  constructor(
    private dialog: MdDialog,
    private snackBar: MdSnackBar,
    private httpService: HttpService,
    private reasonService: ReasonService
  ) { }

  openDialog(typeOfFlagReport: TypeOfReport) {
    const dialogRef = this.dialog.open(FlagDialogComponent, {
      data: {
        flagReportType: typeOfFlagReport
      }
    });
  }

  sendFlagReport(typeOfFlagReport: TypeOfReport, report: string, key: string, currentArea: string) {
    let type: string;
    if (!key) {
      key = null;
    }

    const body = {
      'reason': key,
      'comment': report
    };

    switch (typeOfFlagReport) {
      case TypeOfReport.Post:
      this.httpService.POST('/areas/' + currentArea + '/' + this.currentPost.id + '/flag/', body)
        .subscribe();
        type = 'Post';
        break;
      case TypeOfReport.Comment:
      this.httpService.POST('/areas/' + currentArea + '/' + this.currentPost.id + '/' + this.currentComment.id + '/flag/', body)
        .subscribe();
        type = 'Comment';
        break;
    }

    const snackBarRef = this.snackBar.open(type + ' Flag Report Successful', 'Close', {
      duration: 2000
    });
  }
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
  constructor(@Inject(MD_DIALOG_DATA) public data: any,
    public dialogRef: MdDialogRef<FlagDialogComponent>,
    private reasonService: ReasonService,
    private flagService: FlagService,
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
      this.flagService.sendFlagReport(
        this.data.flagReportType,
        this.model.report,
        this.clickedChoice,
        this.areaService.currentAreaName
      );
  }
}

enum TypeOfReport {
  Post,
  Comment
}
