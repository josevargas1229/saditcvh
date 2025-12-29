import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuditLog } from '../../../../core/models/audit.model';

@Component({
  selector: 'app-log-detail-modal',
  standalone: false,
  templateUrl: './log-detail-modal.html'
})
export class LogDetailModalComponent {
  @Input() log: AuditLog | null = null;
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

  /**
   * Determina si el log actual es una actualización de permisos
   * basándose en la acción o el tipo de detalle.
   */
  isUpdatePerms(): boolean {
    return this.log?.action === 'UPDATE_PERMS' || this.log?.details?.type === 'BATCH_UPDATE';
  }

  getInitials(): string {
    if (!this.log?.user) return 'S';
    const u = this.log.user;
    if (u.first_name && u.last_name) {
      return (u.first_name[0] + u.last_name[0]).toUpperCase();
    }
    return (u.username?.substring(0, 2) || 'S').toUpperCase();
  }

  getChangesKeys(changes: any): string[] {
    // Si es un array (como en el nuevo formato de permisos), no devolvemos llaves
    if (!changes || Array.isArray(changes)) return [];
    return Object.keys(changes);
  }
}