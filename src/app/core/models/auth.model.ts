export interface Role {
  id: number;
  name: string; // 'administrador', 'operador', etc.
}

export interface User {
  id: number;
  username?: string;
  email: string;
  first_name: string;
  last_name: string;
  cargo_id?: number;
  Roles?: Role[];
}

export interface Cargo {
  id: number;
  nombre: string;
}

export interface AuthResponse {
  user: User;
  message?: string;
}
