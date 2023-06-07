import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { AlertController, IonicModule, ModalController, ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-kandidat-detail-modal',
  templateUrl: './kandidat-detail-modal.component.html',
  styleUrls: ['./kandidat-detail-modal.component.scss'],
  imports: [IonicModule, CommonModule],
  standalone: true,
})
export class KandidatDetailModalComponent implements OnInit {
  @Input() data: any;
  @Input() isVoted: any;

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController,
  ) { }

  ngOnInit() {
    console.log(this.data);
  }

  cancel() {
    this.modalController.dismiss();
  }

  voteAlert() {
    this.alertController.create({
      header: "Konfirmasi",
      message: "Apakah anda yakin ingin memilih kandidat ini?",
      buttons: [
        {
          text: "Batal",
          role: "cancel"
        },
        {
          text: "Ya",
          handler: () => {
            this.vote();
          }
        }
      ]
    }).then((res) => {
      res.present();
    });
  }

  async vote() {
    const res = await fetch(`${environment.BASE_URL}vote/${this.data.id}`, {
      method: "POST",
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

    this.toastController.create({
      message: data.message,
      duration: 2000,
      color: "success"
    }).then((res) => {
      res.present();
    });

    this.modalController.dismiss('voted', 'voted');
  }
}
