import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth-service.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  user: any; // Poate fi tipizat mai bine în funcție de modelul utilizatorului

  constructor(private userService: UserService, private authService: AuthService, private router: Router, private dialog: MatDialog) {}

  ngOnInit() {
    const userId = this.authService.getUserId(); // Obține ID-ul utilizatorului autentificat

    if (userId) {
      this.userService.getUserById(userId).subscribe({
        next: (data) => {
          this.user = data; // Setează utilizatorul în componentă
        },
        error: (err) => {
          console.error('Error fetching user:', err);
        }
      });
    } else {
      console.error('No user is logged in'); // Mesaj de eroare dacă nu există utilizator autentificat
    }
  }

  openConfirmDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.logout(); // Apelează metoda de delogare dacă utilizatorul confirmă
      }
    });
  }

  logout(): void {
    this.authService.logout(); // Apelează metoda de delogare
    this.router.navigate(['/login']); // Navighează către pagina de logare
  }
}
