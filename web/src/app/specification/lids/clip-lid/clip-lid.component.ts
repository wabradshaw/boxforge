import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clip-lid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card clip-lid">
      <div class="image-wrapper">
        <img src="/assets/images/lids/clip-box.svg" alt="An open box with notches for a lid to fit into" class="selectable"/>
        <img src="/assets/images/lids/clip-lid-mid.svg" class="lid clip"/>
        <img src="/assets/images/lids/clip-fore.svg"/>
        <img src="/assets/images/lids/clip-lid.svg" alt="A lid with notches in it" class="lid clip"/>
      </div>
      <div class="card-contents">
          <div class="card-title">Clip</div>
          <div class="card-description">A box with a notched lid that clips into the box. The box has raised tabs that slot into the lid. This is {{woodWidth}}mm taller.</div>
      </div>
    </div>
  `,
  styleUrls: ['./clip-lid.component.scss']
})
export class ClipLidComponent {
  woodWidth=4;
}
