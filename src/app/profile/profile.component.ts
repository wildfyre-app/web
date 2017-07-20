import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Author } from '../_models/index';
import { ProfileService } from '../_services/index';

@Component({
  templateUrl: 'profile.component.html'
})
export class ProfileComponent implements OnInit {
  model: any = {};
  author: Author;
  active: boolean;
  showEditButton: boolean;
  banned: boolean;
  constructor(
    private router: Router,
    private profileService: ProfileService
  ) {
    this.active = false;
    this.showEditButton = true;
   }

  ngOnInit() {
    // get posts from secure api end point
    this.profileService.getSelf()
      .subscribe(author => {
        this.author = author;
        this.banned = this.author.banned;
    });
  }
  editProfile() {
    this.active = true;
    this.showEditButton = false;
  }
  cancelEditProfile() {
    this.active = false;
    this.showEditButton = true;
  }
  submitEditProfile() {
    const text = {
      'bio': this.model.bio
    };
    this.profileService.setBio(text);
    this.active = false;
    this.showEditButton = true;
    this.model.bio = '';
    this.ngOnInit();
  }
}
