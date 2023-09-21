import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-open-box',
  standalone: true,
  imports: [CommonModule],
  template: `
      <div class="card open-box">
        <div class="image-wrapper">
            <img src="/assets/images/lids/open.svg" alt="An open box" class="selectable"/>
        </div>
        <div class="card-contents">
            <div class="card-title">Open</div>
            <div class="card-description">A box without a lid. This is the cheapest and smallest option.</div>
        </div>
      </div>
  `,
  styleUrls: ['./open-box.component.scss']
})
export class OpenBoxComponent {  
}