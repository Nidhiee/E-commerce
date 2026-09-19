import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  template: `
    <h1>Login</h1>

    <input type="email" placeholder="Email">
    <br><br>

    <input type="password" placeholder="Password">
    <br><br>

    <button>Login</button>
  `
})
export class Login {
}