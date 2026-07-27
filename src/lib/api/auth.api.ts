import { LoginInput, RegisterInput } from '../schemas/auth.schema';
import { apiFetch } from './api-fetch';
import { authFetch } from './auth-fetch';
import { LoginResponse, UserResponse } from './api.type';

export const AuthApi = {
  register(data: RegisterInput) {
    return apiFetch<void>('/auth/register', {
      method: 'POST',
      body: data
    });
  },

  login(data: LoginInput) {
    return apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: data
    });
  },

  getMe() {
    return authFetch<UserResponse>('/auth/me');
  }
};
