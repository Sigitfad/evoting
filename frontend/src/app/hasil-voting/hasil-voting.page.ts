import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-hasil-voting',
  templateUrl: './hasil-voting.page.html',
  styleUrls: ['./hasil-voting.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HasilVotingPage implements OnInit {
  data: any = {};
  constructor(
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) { }

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: "Mohon tunggu...",
      spinner: "crescent",
      showBackdrop: true
    });
    try {
      this.checkToken();
      await loading.present();
      this.getStats();
    } catch (error) {
      loading.dismiss();
      console.log(error);
    } finally {
      loading.dismiss();
    }
  }

  async getStats() {
    try {
      const res = await fetch(`${environment.BASE_URL}admin/stats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      const json = await res.json();
      if (res.status !== 200) {
        this.alertController.create({
          header: "Gagal",
          message: json.message,
          buttons: ["OK"],
        }).then((res) => {
          res.present();
        });
      }

      this.data = json.data;
    } catch (error) {
      console.log(error);
    }
  }

  async checkToken() {
    if (!localStorage.getItem("token")) {
      this.routeTo("/login");
      return;
    }
  }

  routeTo(path: string) {
    this.router.navigate([path], { replaceUrl: true })
  }

  logout() {
    this.alertController.create({
      header: "Logout",
      message: "Apakah anda yakin ingin logout ?",
      buttons: [
        {
          text: "Tidak",
          role: "cancel",
        },
        {
          text: "Ya",
          handler: () => {
            localStorage.removeItem("token");
            this.toastController.create({
              message: "Logout Berhasil !",
              duration: 2000,
            }).then((res) => {
              res.present();
            });
            this.router.navigateByUrl('login');
          }
        }
      ]
    }).then((res) => {
      res.present();
    });
  }
}
