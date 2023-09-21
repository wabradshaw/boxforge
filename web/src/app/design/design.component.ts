import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-design',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>
      design works!
    </p>
  `,
  styleUrls: ['./design.component.scss']
})
export class DesignComponent {

}
