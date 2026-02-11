import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);

  async googleLogin(idToken: string) {
    try {
      const res = await firstValueFrom(
        this.http.post('http://localhost:3000/auth/signup/gmail', { idToken })
      );
      console.log({ res });
      return res;
    } catch (err) {
      console.error('Google login failed', err);
      throw err;
    }
  }
}
