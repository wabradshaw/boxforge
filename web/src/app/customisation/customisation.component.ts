import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customisation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>
      customisation works!
    </p>
  `,
  styleUrls: ['./customisation.component.scss']
})
export class CustomisationComponent {

}
