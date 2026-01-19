import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { supabase } from '../services/supabase.client';

@Injectable({ providedIn: 'root' })
export class GuestGuard implements CanActivate {
  constructor(private router: Router) {}

  async canActivate(): Promise<boolean | UrlTree> {
    const { data } = await supabase.auth.getSession();

    if (data.session) {
      return this.router.parseUrl('/tabs/dashboard');
    }

    return true;
  }
}
