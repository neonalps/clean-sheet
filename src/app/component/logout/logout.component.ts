import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@src/app/module/auth/service';

@Component({
  selector: 'app-logout',
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent implements OnInit {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  ngOnInit(): void {
      this.authService.logout();
      this.router.navigate(['/login']);
  }

}
