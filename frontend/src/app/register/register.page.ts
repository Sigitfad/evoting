import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RegisterPage implements OnInit {
  form: any = {};
  constructor(
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
  }

  login() {
    this.router.navigateByUrl('login')
  }

  async register() {
    if (!this.form.nama || !this.form.nik || !this.form.no_hp || !this.form.password || !this.form.alamat)
      return this.alertController.create({
        header: "Register Gagal !",
        message: "Semua field harus diisi !",
        buttons: ["OK"],
      }).then((res) => {
        res.present();
      });

    try {
      const res = await fetch(`${environment.BASE_URL}register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nik: this.form.nik,
          name: this.form.nama,
          no_hp: this.form.no_hp.toString(),
          password: this.form.password,
          alamat: this.form.alamat
        })
      });

      const data = await res.json();
      if (res.status !== 200) {
        this.alertController.create({
          header: "Register Gagal !",
          message: data.message,
          buttons: ["OK"],
        }).then((res) => {
          res.present();
        });

        return;
      }

      this.toastController.create({
        message: "Register Berhasil !",
        duration: 2000,
      }).then((res) => {
        this.router.navigateByUrl("login");
        res.present();
      });
    } catch (error) {
      this.alertController.create({
        header: "Register Gagal",
        message: "Terjadi kesalahan",
        buttons: ["OK"],
      }).then((res) => {
        res.present();
      });
    }
  }
}
