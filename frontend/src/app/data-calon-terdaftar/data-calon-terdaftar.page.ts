import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { EditKandidatModalComponent } from '../modals/edit-kandidat-modal/edit-kandidat-modal.component';

@Component({
  selector: 'app-data-calon-terdaftar',
  templateUrl: './data-calon-terdaftar.page.html',
  styleUrls: ['./data-calon-terdaftar.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DataCalonTerdaftarPage implements OnInit {
  data: any;
  constructor(
    private router: Router,
    private alertController: AlertController,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.checkToken();
    this.getAllKandidat();
  }

  async getAllKandidat() {
    const res = await fetch(`${environment.BASE_URL}admin/kandidat`, {
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
  }

  async kandidatModal(data: any, type: string) {
    const modal = await this.modalController.create({
      component: EditKandidatModalComponent,
      componentProps: {
        data: data,
        type: type
      }
    })

    modal.onDidDismiss().then(() => {
      this.getAllKandidat();
    })

    return await modal.present();
  }

  async deleteKandidat(id: string) {
    const al = await this.alertController.create({
      header: "Konfirmasi",
      message: "Apakah anda yakin ingin menghapus kandidat ini?",
      buttons: [
        {
          text: "Tidak",
          role: "cancel"
        },
        {
          text: "Ya",
          handler: async () => {
            try {
              const res = await fetch(`${environment.BASE_URL}admin/kandidat/${id}`, {
                method: "DELETE",
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

              this.getAllKandidat();
            } catch (error: any) {
              this.alertController.create({
                header: "Gagal",
                message: error.message,
                buttons: ["OK"],
              }).then((res) => {
                res.present();
              });
            } finally {
              this.toastController.create({
                message: "Berhasil menghapus kandidat",
                duration: 2000
              }).then((res) => {
                res.present();
              });
            }
          }
        }
      ]
    });

    al.present();
  }


  routeTo(path: string) {
    this.router.navigate([path], { replaceUrl: true })
  }

  checkToken() {
    if (!localStorage.getItem("token")) {
      this.router.navigateByUrl("login-admin");
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
