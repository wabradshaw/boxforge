import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-telescope-lid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card telescope-lid">
      <div class="image-wrapper">
          <img src="/assets/images/lids/telescope-box.svg" alt="An open box" class="graph-paper"/>
          <img src="/assets/images/lids/telescope-lid.svg" alt="A slip on lid" class="lid telescope"/>
      </div>
      <div class="card-contents">
          <div class="card-title">Telescope</div>
          <div class="card-description">A box with a slip on lid. This is {{woodWidth}}mm taller, {{1 + 2 * woodWidth}}mm longer and {{1 + 2 * woodWidth}}mm wider.</div>
      </div>
    </div>
  `,
  styleUrls: ['./telescope-lid.component.scss']
})
export class TelescopeLidComponent {
  woodWidth=4;
}
