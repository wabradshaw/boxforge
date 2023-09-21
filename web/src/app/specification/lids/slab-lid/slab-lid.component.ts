import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-slab-lid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card slab-lid">
      <div class="image-wrapper">
        <img src="/assets/images/lids/slab-box.svg" alt="An open box" class="selectable"/>
        <img src="/assets/images/lids/slab-lid-back.svg" class="lid slab"/>
        <img src="/assets/images/lids/slab-fore.svg"/>
        <img src="/assets/images/lids/slab-lid.svg" alt="A flat lid" class="lid slab"/>
      </div>
      <div class="card-contents">
          <div class="card-title">Slab</div>
          <div class="card-description">A box with a flat lid. The lid has two layers, one that fits on top of the box and one that sits inside it. This is {{2*woodWidth}}mm taller.</div>
      </div>
    </div>
  `,
  styleUrls: ['./slab-lid.component.scss']
})
export class SlabLidComponent {
  woodWidth=4;
}
