import { Component, OnInit } from '@angular/core';
import { User } from '../model/user';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  currentUser:User;
  isLoggedIn=false;
  constructor(private authenticationService:AuthenticationService) { }

  ngOnInit() {
    this.currentUser=this.authenticationService.getUserFromLocalCache();
    this.isLoggedIn=this.authenticationService.isUserLoggedIn();
  }
  

}
