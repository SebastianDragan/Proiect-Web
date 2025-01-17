import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, catchError, throwError } from 'rxjs';

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    // Adaugă alte câmpuri relevante, dacă este necesar
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = 'http://localhost/admin-api/api.php'; // Actualizează cu calea corectă

    constructor(private http: HttpClient) {}

    // Obține toți utilizatorii
    getUserById(userId: number): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}?id=${userId}`).pipe(
        catchError((error) => {
          console.error('Error fetching user:', error);
          return throwError(() => new Error('Error fetching user'));
        })
      );
    }

    // Actualizează utilizatorul
    updateUser(id: number, userData: User): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, userData).pipe(
            catchError(this.handleError) // Gestionează erorile
        );
    }

    // Șterge utilizatorul
    deleteUser(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
            catchError(this.handleError) // Gestionează erorile
        );
    }

    // Funcție pentru gestionarea erorilor
    private handleError(error: any) {
        console.error('An error occurred:', error); // Loghează eroarea
        return throwError(() => new Error('Something went wrong; please try again later.')); // Propaghează eroarea
    }
}
