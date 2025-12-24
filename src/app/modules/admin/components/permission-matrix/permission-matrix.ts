import { Component, OnInit, inject } from '@angular/core';
import { UserService } from '../../../../core/services/user.service';
import { User, Permission, Municipio } from '../../../../core/models/user.model';

@Component({
  selector: 'app-permission-matrix',
  standalone: false,
  templateUrl: './permission-matrix.html'
})
export class PermissionMatrixComponent implements OnInit {

  selectedUserId: number | null = null;
  private userService = inject(UserService);

  usersList: User[] = [];
  permissionsColumns: Permission[] = [];

  allMunicipiosRows: any[] = [];
  displayedRows: any[] = [];

  accessMatrix: { [key: number]: { [key: number]: boolean } } = {};
  originalMatrix: { [key: number]: { [key: number]: boolean } } = {};

  loading = false;
  saving = false;
  loadingUsers = false;
  hasChanges = false; // Esto habilitará el botón

  pagination = { page: 1, limit: 5, total: 0 };
  pageSizeOptions = [5, 10, 20, 50];
  searchTerm = '';

  isAssignModalOpen = false;
  loadingCatalog = false;
  catalogMunicipios: Municipio[] = [];
  filteredCatalog: Municipio[] = [];
  displayedCatalog: Municipio[] = [];
  selectedMunicipiosIds: Set<number> = new Set();
  modalSearchTerm = '';
  renderLimit = 50;

  ngOnInit(): void {
    this.loadCatalogues();
    this.loadUsersList();
    this.preloadMunicipiosCatalog();
  }

  loadCatalogues() {
    this.userService.getAllPermissions().subscribe(res => {
      if (res.success) this.permissionsColumns = res.data || [];
    });
  }

  loadUsersList() {
    this.loadingUsers = true;
    this.userService.getAllUsers({ limit: 1000, active: 'true' }).subscribe({
      next: (res: any) => {
        this.usersList = res.rows || res.data || [];
        this.loadingUsers = false;
      },
      error: () => this.loadingUsers = false
    });
  }

  preloadMunicipiosCatalog() {
    this.userService.getAllMunicipios().subscribe(res => {
      if (res.success) this.catalogMunicipios = res.data;
    });
  }

  onUserChange() {
    this.allMunicipiosRows = [];
    this.displayedRows = [];
    this.accessMatrix = {};
    this.hasChanges = false;
    this.pagination.page = 1;
    this.pagination.total = 0;

    if (this.selectedUserId) {
      this.loadUserMatrix();
    }
  }

  loadUserMatrix() {
    if (!this.selectedUserId) return;

    // Solo mostramos loading si realmente estamos trayendo datos,
    // pero mantenemos la estructura visual
    this.loading = true;
    this.hasChanges = false;

    this.userService.getUserById(this.selectedUserId).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.processData(res.data);
          this.updateSelectedIdsFromMatrix();
        }
      },
      error: () => this.loading = false
    });
  }

  processData(user: User) {
    const muniMap = new Map();
    this.accessMatrix = {};

    if (user.municipality_access && user.municipality_access.length > 0) {
      user.municipality_access.forEach(access => {
        if (access.municipio && access.municipio.id) {
          if (!muniMap.has(access.municipio_id)) {
            muniMap.set(access.municipio_id, access.municipio);
            this.accessMatrix[access.municipio_id] = {};
          }
          this.accessMatrix[access.municipio_id][access.permission_id] = true;
        }
      });
    }

    // Guardamos el estado original para comparar después
    this.originalMatrix = JSON.parse(JSON.stringify(this.accessMatrix));

    this.allMunicipiosRows = Array.from(muniMap.values())
        .sort((a: any, b: any) => (a.num || 0) - (b.num || 0));

    this.updateTable();
  }

  updateSelectedIdsFromMatrix() {
    this.selectedMunicipiosIds.clear();
    this.allMunicipiosRows.forEach(m => this.selectedMunicipiosIds.add(m.id));
  }

  // --- MODAL ---
  openAssignModal() {
    this.isAssignModalOpen = true;
    this.modalSearchTerm = '';
    this.renderLimit = 50;

    if (this.catalogMunicipios.length > 0) {
      this.filterLocal();
    } else {
      this.loadingCatalog = true;
      this.userService.getAllMunicipios().subscribe(res => {
        this.loadingCatalog = false;
        if (res.success) {
          this.catalogMunicipios = res.data;
          this.filterLocal();
        }
      });
    }
  }

  filterLocal() {
    let results = this.catalogMunicipios;
    if (this.modalSearchTerm.trim()) {
      const term = this.modalSearchTerm.toLowerCase();
      results = results.filter(m => m.nombre.toLowerCase().includes(term) || m.num.toString().includes(term));
    }
    this.filteredCatalog = results;
    this.updateDisplayedCatalog();
  }

  updateDisplayedCatalog() {
    this.displayedCatalog = this.filteredCatalog.slice(0, this.renderLimit);
  }

  onModalScroll(event: any) {
    const el = event.target;
    if (el.scrollHeight - el.scrollTop <= el.clientHeight + 50) {
      if (this.renderLimit < this.filteredCatalog.length) {
        this.renderLimit += 50;
        this.updateDisplayedCatalog();
      }
    }
  }

  closeAssignModal() {
    this.isAssignModalOpen = false;
    this.updateSelectedIdsFromMatrix();
  }

  toggleSelection(muniId: number) {
    if (this.selectedMunicipiosIds.has(muniId)) {
      this.selectedMunicipiosIds.delete(muniId);
    } else {
      this.selectedMunicipiosIds.add(muniId);
    }
  }



  saveAssignments() {
    this.isAssignModalOpen = false;

    const verPermiso = this.permissionsColumns.find(p => p.name.toLowerCase() === 'ver') || this.permissionsColumns[0];

    // Quitamos de la vista los desmarcados (solo visual)
    Object.keys(this.accessMatrix).forEach(muniIdStr => {
        const muniId = parseInt(muniIdStr);
        if (!this.selectedMunicipiosIds.has(muniId)) {
            delete this.accessMatrix[muniId];
        }
    });

    // Agregamos los nuevos con permiso "Ver"
    this.selectedMunicipiosIds.forEach(muniId => {
        if (!this.accessMatrix[muniId]) {
            this.accessMatrix[muniId] = {};
            if (verPermiso) this.accessMatrix[muniId][verPermiso.id] = true;
        }
    });

    // Reconstruimos la tabla visualmente
    const selectedFullObjects = this.catalogMunicipios.filter(m => this.selectedMunicipiosIds.has(m.id));
    this.allMunicipiosRows = selectedFullObjects.sort((a, b) => a.num - b.num);

    this.updateTable();

    // Verificamos cambios contra la original
    // Como modificamos accessMatrix pero NO originalMatrix, checkChanges detectará diferencias
    // y habilitará el botón "Guardar Cambios".
    this.checkChanges();
  }


  saveChanges() {
    if (!this.selectedUserId) return;

    // No ponemos loading = true para no bloquear la tabla
    const changes = [];

    // Recolectamos diferencias (Nuevos municipios serán detectados aquí también)
    for (const muniId of this.allMunicipiosRows.map(m => m.id)) {
        for (const perm of this.permissionsColumns) {
            const originalVal = this.originalMatrix[muniId] ? !!this.originalMatrix[muniId][perm.id] : false;
            const currentVal = this.accessMatrix[muniId] ? !!this.accessMatrix[muniId][perm.id] : false;

            if (originalVal !== currentVal) {
                changes.push({
                    municipioId: muniId,
                    permissionId: perm.id,
                    value: currentVal
                });
            }
        }
    }

    // También detectamos si se BORRARON municipios (están en original pero no en actual)
    const currentMuniIds = new Set(this.allMunicipiosRows.map(m => m.id));
    Object.keys(this.originalMatrix).forEach(origMuniStr => {
        const origMuniId = parseInt(origMuniStr);
        if (!currentMuniIds.has(origMuniId)) {
            // Este municipio fue eliminado visualmente, hay que mandar borrar sus permisos
            for (const perm of this.permissionsColumns) {
                if (this.originalMatrix[origMuniId][perm.id]) {
                    changes.push({
                        municipioId: origMuniId,
                        permissionId: perm.id,
                        value: false // False = Borrar
                    });
                }
            }
        }
    });

    if (changes.length === 0) {
        this.hasChanges = false;
        return;
    }



    // Actualizamos el "Backup" inmediatamente (asumiendo éxito)
    this.originalMatrix = JSON.parse(JSON.stringify(this.accessMatrix));
    this.hasChanges = false; // Deshabilita el botón al instante

    // Mensaje simple inmediato
    alert('Cambios aplicados correctamente.');

    // Enviamos al backend en "silencio"
    this.userService.updatePermissionsBatch(this.selectedUserId, changes).subscribe({
        next: () => console.log('Sincronizado con BD'),
        error: (err) => {
            console.error('Error de sincronización', err);
            // Solo molestamos al usuario si algo falló gravemente
            alert('Advertencia: Hubo un problema de conexión al guardar en el servidor.');
        }
    });
  }

  // --- TABLA Y UTILIDADES ---

  updateTable() {
    let filtered = this.allMunicipiosRows;
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(m => m.nombre.toLowerCase().includes(term));
    }
    this.pagination.total = filtered.length;
    const startIndex = (this.pagination.page - 1) * this.pagination.limit;
    this.displayedRows = filtered.slice(startIndex, startIndex + this.pagination.limit);

    if(this.displayedRows.length === 0 && this.pagination.page > 1) {
        this.pagination.page = 1;
        this.updateTable();
    }
  }

  hasPermission(municipioId: number, permissionId: number): boolean {
    return this.accessMatrix[municipioId] ? !!this.accessMatrix[municipioId][permissionId] : false;
  }

  toggle(municipioId: number, permissionId: number, event: any) {
    const isChecked = event.target.checked;
    if (!this.accessMatrix[municipioId]) this.accessMatrix[municipioId] = {};
    this.accessMatrix[municipioId][permissionId] = isChecked;
    this.checkChanges();
  }

  checkChanges() {
    let changed = false;

    // Checar cambios en municipios visibles
    for (const muniId of this.allMunicipiosRows.map(m => m.id)) {
        for (const perm of this.permissionsColumns) {
            const originalVal = this.originalMatrix[muniId] ? !!this.originalMatrix[muniId][perm.id] : false;
            const currentVal = this.accessMatrix[muniId] ? !!this.accessMatrix[muniId][perm.id] : false;
            if (originalVal !== currentVal) {
                changed = true; break;
            }
        }
        if (changed) break;
    }

    // Checar si se borraron municipios (longitudes diferentes)
    if (!changed) {
        const originalKeys = Object.keys(this.originalMatrix).length;
        const currentKeys = Object.keys(this.accessMatrix).length;
        if (originalKeys !== currentKeys) changed = true;
    }

    this.hasChanges = changed;
  }

  cancelChanges() {
    if (!confirm('¿Deshacer cambios pendientes?')) return;

    // Restaurar desde el backup
    this.accessMatrix = JSON.parse(JSON.stringify(this.originalMatrix));

    // Restaurar filas visuales
    const originalMuniIds = new Set(Object.keys(this.originalMatrix).map(Number));
    const restoredObjects = this.catalogMunicipios.filter(m => originalMuniIds.has(m.id));
    this.allMunicipiosRows = restoredObjects.sort((a, b) => a.num - b.num);
    this.selectedMunicipiosIds = new Set(originalMuniIds);

    this.updateTable();
    this.hasChanges = false;
  }

  onSearchChange() { this.pagination.page = 1; this.updateTable(); }
  changePage(p: number) { this.pagination.page = p; this.updateTable(); }
  get totalPages() { return Math.ceil(this.pagination.total / this.pagination.limit); }
  trackByMuni(index: number, item: any): number { return item.id; }
}
