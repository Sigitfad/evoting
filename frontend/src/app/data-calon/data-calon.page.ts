import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-data-calon',
  templateUrl: './data-calon.page.html',
  styleUrls: ['./data-calon.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DataCalonPage implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  routeTo(path: string) {
    this.router.navigate([path], { replaceUrl: true })
  }
}
