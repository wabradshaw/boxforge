import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-specification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>
      specification works!
    </p>
  `,
  styleUrls: ['./specification.component.scss']
})
export class SpecificationComponent {

}
