import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = '/api';

    public login(username: string, password: string) {
        return this.http.post<{ access_token: string }>(`${this.baseUrl}/auth/login`, { username, password });
    }
}