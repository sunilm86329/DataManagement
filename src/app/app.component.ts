import { Component } from "@angular/core";
import { RouterOutlet, RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="container">
      <header>
        <h1>Data Management System</h1>
        <nav>
          <ul class="nav-tabs">
            <li class="nav-item">
              <a class="nav-link" routerLink="/add" routerLinkActive="active"
                >Add Data</a
              >
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/show" routerLinkActive="active"
                >Show Data</a
              >
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
      header {
        padding: 24px 0;
      }

      h1 {
        color: var(--primary);
        margin-bottom: 24px;
      }

      footer {
        margin-top: 40px;
        padding: 24px 0;
        text-align: center;
        color: var(--secondary);
        border-top: 1px solid #dee2e6;
      }
    `,
  ],
})
export class AppComponent {
  title = "Data Management System";
}
