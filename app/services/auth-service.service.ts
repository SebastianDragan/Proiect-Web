import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    // Adaugă alte câmpuri relevante, dacă este necesar
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private apiUrl = 'http://localhost/admin-api';
    user: User | null = null;

    constructor(private http: HttpClient) {}


    // Metodă pentru înregistrare
    register(userData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/register.php`, userData).pipe(
            map((response) => {
                return response; // Poți face prelucrări suplimentare aici dacă este necesar
            }),
            catchError((error) => {
                return throwError(error); // Propaghează eroarea
            })
        );
    }

    login(credentials: { email: string; password: string }): Observable<any> {
      return this.http.post(`${this.apiUrl}/login.php`, credentials).pipe(
          map((response: any) => {
              if (response.token) {
                  localStorage.setItem('token', response.token); // Salvează token-ul
              }
              if (response.user) {
                  localStorage.setItem('user', JSON.stringify(response.user)); // Salvează detaliile utilizatorului
              }
              return response;
          }),
          catchError((error) => {
              console.error('Login error:', error);
              return throwError(error); // Propaghează eroarea
          })
      );
  }

    // Obține ID-ul utilizatorului
    getUserId(): number | null {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        return user.id; // Returnează ID-ul utilizatorului
      }
      return null; // Dacă utilizatorul nu este găsit
    }


    getProtectedData(): Observable<any> {
        const token = this.getToken();
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get(`${this.apiUrl}/protected-endpoint.php`, { headers });
    }

    saveToken(token: string) {
        localStorage.setItem('jwt', token); // Salvează token-ul în localStorage
    }

    getToken() {
        return localStorage.getItem('jwt'); // Obține token-ul din localStorage
    }

    isAuthenticated(): boolean {
        const token = this.getToken();
        return !!token; // Returnează true dacă există un token
    }

    logout(): void {
      localStorage.removeItem('token'); // Șterge token-ul din localStorage
      localStorage.removeItem('user'); // Șterge detaliile utilizatorului
    }

    // Metoda pentru a verifica dacă utilizatorul este autentificat
    isLoggedIn(): boolean {
      return !!localStorage.getItem('token'); // Verifică dacă token-ul există
    }
}
