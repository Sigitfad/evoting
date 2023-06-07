import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { Router } from "@angular/router";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {
  form: any = {};

  constructor(
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {
  }

  registrasi() {
    this.router.navigateByUrl('register')
  }

  async masuk() {
    if (!this.form.nik || !this.form.password) return this.alertController.create({
      header: "Login Gagal !",
      message: "NIK dan Password harus diisi !",
      buttons: ["OK"],
    }).then((res) => {
      res.present();
    });

    try {
      const loading = await this.loadingController.create({
        message: "Loading...",
      });
      await loading.present();

      const res = await fetch(environment.BASE_URL + "login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nik: this.form.nik,
          password: this.form.password,
        })
      });

      const data = await res.json();
      if (res.status !== 200) {
        this.alertController.create({
          header: "Login Gagal !",
          message: data.message,
          buttons: ["OK"],
        }).then((res) => {
          loading.dismiss();
          res.present();
        });
      }

      localStorage.setItem("token", data.data.token);

      this.toastController.create({
        message: "Login Berhasil !",
        duration: 2000,
      }).then((res) => {
        loading.dismiss();
        res.present();
        this.router.navigateByUrl("content");
      });
    } catch (err: any) {
      console.log(err);
    }
  }

  ngOnInit() {
    this.checkToken();
  }



  checkToken() {
    const token = localStorage.getItem("token");
    if (token) {
      this.router.navigateByUrl("content");
    }
  }

  loginAdmin() {
    this.router.navigateByUrl("login-admin");
  }
}
