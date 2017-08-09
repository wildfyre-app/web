import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Author } from '../_models/index';
import { ProfileService } from '../_services/index';

@Component({
  templateUrl: 'profile.component.html'
})
export class ProfileComponent implements OnInit {
  model: any = {};
  author: Author;
  edit: boolean;
  self: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private profileService: ProfileService
  ) {
    this.edit = false;
   }

  ngOnInit() {
    this.route.params.subscribe((parms) => {
      if (parms['id']) {
        this.profileService.getUser(parms['id']).subscribe((user: Author) => {
          this.self = false;
          this.author = user;
        });
      } else {
        this.profileService.getSelf().subscribe((self: Author) => {
          this.author = self;
          this.model.bio = this.author.bio;
          this.self = true;
        });
      }
    });
  }

  editProfile() {
    this.edit = true;
  }

  cancelEditProfile() {
    this.edit = false;
  }

  submitEditProfile() {
    this.profileService.setBio(this.author, this.model.bio).subscribe();
    this.edit = false;
  }
}
