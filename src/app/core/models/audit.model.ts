// src/app/core/models/audit.model.ts
import { User } from './user.model';

// 1. Interfaz base con campos comunes
interface AuditLogBase {
  id: number;
  user_id: number | null;
  action: string;
  module: string;
  entity_id: string | null;
  ip_address: string;
  created_at: string;
}

// 2. Interfaz para la tabla (Ligera)
export interface AuditLogSummary extends AuditLogBase {
  user?: {
    username: string;
  };
}

// 3. Interfaz completa para el detalle (Modal)
export interface AuditLog extends AuditLogBase {
  user_agent: string;
  details: AuditDetails;
  // Aquí definimos el usuario con toda su información y roles
  user?: Partial<User> & { roles?: any[] }; 
}

export interface AuditDetails {
  device_detected?: string;
  target_user?: string;     // <-- Nuevo
  municipality?: string;    // <-- Nuevo
  total_changes?: number;   // <-- Nuevo
  type?: string;            // <-- Nuevo
  changes?: {
    added?: string[];       // Ahora puede ser un array de strings (permisos)
    removed?: string[];     // Ahora puede ser un array de strings
    [key: string]: any;     // Mantiene compatibilidad con el formato old/new anterior
  };
  data?: any;
  [key: string]: any;
}
export interface AuditParams {
  page?: number;
  limit?: number;
  module?: string;
  action?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  roleId?: string | number;
  sort?: 'ASC' | 'DESC';
}