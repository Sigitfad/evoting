import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.page.html',
  styleUrls: ['./login-admin.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginAdminPage implements OnInit {
  form: any = {};

  constructor(
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.checkToken();
  }

  checkToken() {
    if (localStorage.getItem("token")) {
      this.router.navigateByUrl("data-calon");
    }
  }

  back() {
    this.router.navigate(["/login"]);
  }

  async login() {
    if (!this.form.email || !this.form.password) return this.alertController.create({
      header: "Login Gagal !",
      message: "Semua field harus diisi",
      buttons: ["OK"],
    }).then((res) => {
      res.present();
    });

    const loading = await this.loadingController.create({
      message: "Mohon tunggu...",
      spinner: "crescent",
      showBackdrop: true
    });

    loading.present();
    try {
      const res = await fetch(`${environment.BASE_URL}login/admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: this.form.email,
          password: this.form.password
        })
      });

      const data = await res.json();
      if (res.status !== 200) {
        this.alertController.create({
          header: "Login Gagal !",
          message: data.message,
          buttons: ["OK"],
        }).then((res) => {
          res.present();
          loading.dismiss();
        });
        return;
      }

      localStorage.setItem("token", data.data.token);
      loading.dismiss();
      this.router.navigateByUrl("data-calon-terdaftar");

    } catch (error) {
      console.log(error);
    }
  }
}
