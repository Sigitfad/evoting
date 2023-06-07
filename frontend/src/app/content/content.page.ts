import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { KandidatDetailModalComponent } from '../modals/kandidat-detail-modal/kandidat-detail-modal.component';


@Component({
  selector: 'app-example',
  templateUrl: 'content.page.html',
  styleUrls: ['./content.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ContentPage implements OnInit {
  constructor(
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private modalController: ModalController
  ) { }
  data: any;

  ngOnInit() {
    this.checkToken();

    this.getAllKandidat();
  }

  async getAllKandidat() {
    const loading = await this.loadingController.create({
      message: "Loading...",
    });
    await loading.present();

    try {
      const res = await fetch(`${environment.BASE_URL}kandidat`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      const data = await res.json();
      if (res.status !== 200) {
        this.alertController.create({
          header: "Gagal",
          message: data.message,
          buttons: ["OK"],
        }).then((res) => {
          res.present();
        });
      }

      this.data = data.data;
      loading.dismiss();
    } catch (error) {
      loading.dismiss();
      console.log(error);
    }
  }

  async kandidatModal(item: any, isVoted: boolean) {
    const modal = await this.modalController.create({
      component: KandidatDetailModalComponent,
      componentProps: {
        data: item,
        isVoted: isVoted
      }
    });

    modal.onDidDismiss().then((res) => {
      if (res.data) {
        this.getAllKandidat();
      }
    });

    return await modal.present();
  }

  checkToken() {
    if (!localStorage.getItem("token")) {
      this.router.navigateByUrl('login')
    }
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
