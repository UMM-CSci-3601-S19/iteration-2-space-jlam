import {Injectable} from "@angular/core";
import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../environments/environment';
import 'rxjs/add/observable/of';

//Code credited to group Bananya Squad iteration 2

@Injectable()
export class AppService implements OnInit{

  googleAuth;
  userFullName: string;
  userFirstName: string;
  userEmail: string;

  constructor(private http: HttpClient,) {
  }


  title = 'Ride-share';

  // This signs in the user and opens the window for signing in
  signIn() {
    this.googleAuth = gapi.auth2.getAuthInstance();
    console.log(" This is google Auth " + this.googleAuth);
    this.googleAuth.grantOfflineAccess().then((resp) => {
      localStorage.setItem('isSignedIn', 'true');
      this.sendAuthCode(resp.code);
    });
  }

  signOut() {
    this.handleClientLoad();

    this.googleAuth = gapi.auth2.getAuthInstance();

    this.googleAuth.then(() => {
      this.googleAuth.signOut();
      localStorage.setItem('isSignedIn', 'false');
      localStorage.setItem("userID", "");
      window.location.reload();
    })
  }

  // This sends the auth code of our user to the server and stores the fields in local storage when we get data back
  // from gapi
  sendAuthCode(code: string): void {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    };

    this.http.post(environment.API_URL + "login", {code: code}, httpOptions)
      .subscribe(onSuccess => {
        console.log("Code sent to server");
        console.log(onSuccess["_id"]);
        console.log(onSuccess["_id"]["$oid"]);
        console.log(onSuccess["email"]);
        console.log(onSuccess["fullName"]);
        console.log(onSuccess["lastName"]);
        console.log(onSuccess["firstName"]);
        localStorage.setItem("_id", onSuccess["_id"]);
        localStorage.setItem("oid", onSuccess["_id"]["$oid"]);
        localStorage.setItem("email", onSuccess["email"]);
        localStorage.setItem("userFullName", onSuccess["fullName"]);
        localStorage.setItem("userLastName", onSuccess["lastName"]);
        localStorage.setItem("userFirstName", onSuccess["firstName"]);

      }, onFail => {
        console.log("ERROR: Code couldn't be sent to the server");
      });
  }


  getUsername () {
    this.userFullName = localStorage.getItem("userFullName");
    /*if (this.userFullName.length > 18) {
      this.userFullName = this.userFullName.slice(0, 17) + "...";
    }*/
    return this.userFullName;
  }


  handleClientLoad() {
    gapi.load('client:auth2', this.initClient);
  }

  initClient() {
    gapi.client.init({
      'clientId': '207007000749-dgpb2fb5f4grk2r7ep34j9qhgl8jvvu3.apps.googleusercontent.com',
      'scope': 'profile email'
    });
  }

  public isSignedIn(): boolean {
    status = localStorage.getItem('isSignedIn');
    if (status == 'true') {
      return true;
    }
    else {
      return false;
    }
  }

  ngOnInit() {
    this.handleClientLoad();
    this.getUsername();
    /*gapi.load('client:auth2', this.initClient);*/
  }
}
