import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>
      review works!
    </p>
  `,
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent {

}
