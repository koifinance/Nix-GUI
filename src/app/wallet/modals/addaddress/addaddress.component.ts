import { Component, OnInit } from '@angular/core';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-addaddress',
  templateUrl: './addaddress.component.html',
  styleUrls: ['./addaddress.component.scss']
})
export class AddaddressComponent implements OnInit {
  faEyeSlash: any = faEyeSlash;
  faEye: any = faEye;
  showPassword: boolean = false;
  constructor() { }

  ngOnInit() {
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  passwordLabelText(): string {
    return this.showPassword ? 'Hide' : 'Show';
  }
}
