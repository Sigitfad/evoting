import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, ModalController, ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-kandidat-modal',
  templateUrl: './edit-kandidat-modal.component.html',
  styleUrls: ['./edit-kandidat-modal.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
  standalone: true
})
export class EditKandidatModalComponent implements OnInit {
  @Input() data: any;
  @Input() type: string | undefined;

  form: any = {};
  img: any;

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.form = this.data;
  }

  cancel() {
    this.modalController.dismiss();
  }

  loadImage(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      this.form.foto_kandidat = reader.result as string;
      this.img = file;
    }

    reader.onerror = (error) => {
      console.log(error);
    }
  }

  save() {
    if (
      !this.form.nama_ketua || !this.form.nik_ketua || !this.form.nama_wakil || !this.form.nik_wakil || !this.form.visi || !this.form.misi ||
      !this.form.pendidikan_terakhir_ketua || !this.form.pendidikan_terakhir_wakil || !this.form.foto_kandidat
    ) return this.alertController.create({
      header: "Gagal",
      message: "Semua field harus diisi",
      buttons: ["OK"],
    }).then((res) => {
      res.present();
    });
    switch (this.type) {
      case "add":
        this.addKandidat();
        break;
      case "edit":
        this.updateKandidat();
        break;
    }

    return;
  }

  async addKandidat() {
    const formData = new FormData();
    formData.append("nama_ketua", this.form.nama_ketua);
    formData.append("nik_ketua", this.form.nik_ketua);
    formData.append("nama_wakil", this.form.nama_wakil);
    formData.append("nik_wakil", this.form.nik_wakil);
    formData.append("pendidikan_terakhir_ketua", this.form.pendidikan_terakhir_ketua);
    formData.append("pendidikan_terakhir_wakil", this.form.pendidikan_terakhir_wakil);
    formData.append("visi", this.form.visi);
    formData.append("misi", this.form.misi);
    formData.append("foto_kandidat", this.img);


    const res = await fetch(`${environment.BASE_URL}admin/kandidat`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: formData
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

    this.toastController.create({
      message: json.message,
      duration: 2000
    }).then((res) => {
      res.present();
    });

    this.modalController.dismiss();
  }

  async updateKandidat() {
    const formData = new FormData();
    formData.append("nama_ketua", this.form.nama_ketua);
    formData.append("nik_ketua", this.form.nik_ketua);
    formData.append("nama_wakil", this.form.nama_wakil);
    formData.append("nik_wakil", this.form.nik_wakil);
    formData.append("pendidikan_terakhir_ketua", this.form.pendidikan_terakhir_ketua);
    formData.append("pendidikan_terakhir_wakil", this.form.pendidikan_terakhir_wakil);
    formData.append("visi", this.form.visi);
    formData.append("misi", this.form.misi);
    // if foto is not changed dont send it
    if (this.img) {
      formData.append("foto_kandidat", this.img);
    }

    const res = await fetch(`${environment.BASE_URL}admin/kandidat/${this.form.id}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: formData
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

    this.toastController.create({
      message: json.message,
      duration: 2000
    }).then((res) => {
      res.present();
    });

    this.modalController.dismiss();

  }

}

