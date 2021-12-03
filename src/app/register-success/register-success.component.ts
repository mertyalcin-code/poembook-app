import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register-success',
  templateUrl: './register-success.component.html',
  styleUrls: ['./register-success.component.css']
})
export class RegisterSuccessComponent implements OnInit {

  message = "Kayıt olduğun için teşekkürler. Şifren için mail adresini kontrol edebilirsin. Spam klasörüne bakmayı unutma"
  constructor() { }

  ngOnInit() {

  }

}
