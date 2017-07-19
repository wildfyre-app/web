import { Component, OnInit } from '@angular/core';
import { Author } from '../_models/index';
import { ProfileService } from '../_services/index';

@Component({
  templateUrl: 'profile.component.html'
})
export class ProfileComponent implements OnInit {
  author: Author;
  constructor(
    private profileService: ProfileService
  ) { }

  ngOnInit() {
    // get posts from secure api end point
    this.profileService.getSelf()
      .subscribe(author => {
        this.author = author;
    });
  }
}
