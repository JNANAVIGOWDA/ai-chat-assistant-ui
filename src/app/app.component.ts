import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Root AppComponent
 * Serves as the primary shell container rendering active routed components via RouterOutlet.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'AI Chat Assistant UI';
}
