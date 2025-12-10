# SADIT-CVH – Front-End  

## 1. Objetivo general  
Ofrecer una aplicación web rápida, accesible y segura que permita al administrador único del Sistema de Transporte Convencional de Hidalgo:  
1. Catalogar y digitalizar 30 000 expedientes.  
2. Consultar, descargar e imprimir carátulas y etiquetas.  
3. Generar reportes de inventario y auditoría.  
4. Gestionar usuarios internos y respaldos automáticos.  

## 2. Stack técnico  
- Angular 17 (modular, sin standalone)  
- Lazy-loading por módulo  
- TailwindCSS 3 (UI completa, sin .scss propios)  
- RxJS + HttpClient  
- NgXs (state global: auth, ui, expedientes)  
- JWT corto (15 min) + Refresh-Token (7 días, http-only cookie) ← integración cuando exista backend  
- Angular Guards (CanLoad, CanActivate)  
- PWA (opcional) para cámara/escáner offline  

## 3. Estructura de carpetas árbol limpio y escalable

```
src/app/
├── public/                      # Módulo público
│   ├── public.module.ts
│   ├── public-routing.module.ts
│   ├── pages/
│   │   ├── home.view.ts
│   │   └── notfound.view.ts
│   └── components/
│       ├── hero.component.ts
│       ├── navbar.component.ts
│       └── footer.component.ts
├── auth/                        # Módulo de autenticación
│   ├── auth.module.ts
│   ├── auth-routing.module.ts
│   └── pages/
│       └── login.view.ts
├── admin/                       # Único módulo admin
│   ├── admin.module.ts
│   ├── admin-routing.module.ts
│   ├── admin-shell.component.ts
│   ├── pages/                   # Vistas (sin submódulos)
│   │   ├── dashboard.view.ts
│   │   ├── expedientes.view.ts
│   │   ├── digitalizacion.view.ts
│   │   ├── reportes.view.ts
│   │   ├── usuarios.view.ts
│   │   ├── respaldos.view.ts
│   │   └── auditoria.view.ts
│   └── components/              # Componentes reutilizables
│       ├── sidebar.component.ts
│       ├── header.component.ts
│       ├── kpi-card.component.ts
│       ├── expedientes-table.component.ts
│       └── expediente-form.component.ts
├── core/                        # Servicios globales
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── expediente.service.ts
│   └── guards/
│       └── auth.guard.ts
└── shared/                      # Interfaces, utilidades, enums
    ├── models/
    │   └── expediente.model.ts
    └── utils/
        └── constants.ts
```


## 4. Comandos de generación 
 
```bash
# 0. Proyecto base
ng new SADIT-CVH --routing --style=scss
cd SADIT-CVH
npm i -D tailwindcss postcss autoprefixer
npx tailwindcss init

# 1. Módulos raíz

ng g m modules/public       --routing
ng g m modules/auth         --routing
ng g m modules/admin        --routing
# 1.2 Componentes de modulos raíz
ng g c modules/public --style=none
ng g c modules/auth --style=none
ng g c modules/admin --style=none

# 2. Public (vistas + componentes)
ng g c modules/public/pages/home        --type=view --skip-selector -m public --style=none
ng g c modules/public/pages/notfound    --type=view --skip-selector -m public --style=none
ng g c modules/public/components/hero   -m public --style=none
ng g c modules/public/components/navbar -m public --style=none

# 3. Auth (vista login)
ng g c modules/auth/pages/login --type=view --skip-selector -m auth --style=none

# 4. Admin shell
ng g c modules/admin/admin-shell -m admin --style=none

# 5. Admin vistas (pages)
ng g c modules/admin/pages/dashboard     --type=view --skip-selector -m admin --style=none
ng g c modules/admin/pages/expedientes   --type=view --skip-selector -m admin --style=none
ng g c modules/admin/pages/digitalizacion --type=view --skip-selector -m admin --style=none
ng g c modules/admin/pages/reportes      --type=view --skip-selector -m admin --style=none
ng g c modules/admin/pages/usuarios      --type=view --skip-selector -m admin --style=none
ng g c modules/admin/pages/respaldos     --type=view --skip-selector -m admin --style=none
ng g c modules/admin/pages/auditoria     --type=view --skip-selector -m admin --style=none

# 6. Admin componentes reutilizables
ng g c modules/admin/components/sidebar          -m admin --style=none
ng g c modules/admin/components/header           -m admin --style=none
ng g c modules/admin/components/kpi-card         -m admin --style=none
ng g c modules/admin/components/expedientes-table -m admin --style=none
ng g c modules/admin/components/expediente-form  -m admin --style=none

# 7. Core (servicios y guards)
ng g s core/auth
ng g s core/expediente
ng g guard guards/auth --implements CanLoad,CanActivate
```

## 5. Rutas 

```ts
const routes: Routes = [
  { path: '', redirectTo: 'modules/public/home', pathMatch: 'full' },
  {
    path: 'public',
    loadChildren: () => import('.modules/public/public.module').then(m => m.PublicModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('.modules/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('.modules/admin/admin.module').then(m => m.AdminModule),
    canLoad: [AuthGuard]
  },
  { path: '**', redirectTo: 'modules/public/notfound' }
];
```

**admin-routing.module.ts**
```ts
const routes: Routes = [
  {
    path: '',
    component: AdminShellComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard',     component: DashboardViewComponent },
      { path: 'expedientes',   component: ExpedientesViewComponent },
      { path: 'digitalizacion',component: DigitalizacionViewComponent },
      { path: 'reportes',      component: ReportesViewComponent },
      { path: 'usuarios',      component: UsuariosViewComponent },
      { path: 'respaldos',     component: RespaldosViewComponent },
      { path: 'auditoria',     component: AuditoriaViewComponent }
    ]
  }
];
```

## 6. Funcionalidades por vista admin

| Vista | Funciones clave |
|--------|-----------------|
| **dashboard** | KPIs, % digitalizado, espacio en disco, últimas acciones. |
| **expedientes** | Listado con filtros, formulario alta/edición, impresión de carátulas y etiquetas. |
| **digitalizacion** | Captura webcam/escáner, OCR, validaciones, visor de calidad. |
| **reportes** | Excel/PDF de inventario y auditoría. |
| **usuarios** | CRUD de usuarios internos, reset de contraseña. |
| **respaldos** | Backup/restore full o por fondo/sección, cifrado ZIP. |
| **auditoria** | Log de acciones con filtros y exportación CSV. |

## 7. Seguridad en front (hasta backend)

| Control | Implementación |
|---------|----------------|
| HTTPS | Obligatorio en prod |
| Guards | `CanLoad` + `CanActivate` |
| Tokens | Access en RxJs, refresh en cookie http-only |
| Validaciones | ReactiveForms + sanitización Angular |
| Archivos | mime-type, tamaño, resolución mínima, checksum SHA-256 |
| Headers | `X-Content-Type-Options`, `X-Frame-Options`, CSP básica |
| Dependencias | `npm audit` en pre-commit hook |
| Audit trail | `X-Request-ID` en cada llamada |

## 8. Scripts de desarrollo

```bash
ng serve -o
ng build --configuration production --aot --build-optimizer
npm audit && npm audit fix
```

## 9. Entregables fase 1 (front)

1. Código fuente Angular comentado.  
2. Documento de rutas y guards.  
3. Manual de usuario PDF (generado desde `/public/home`).  
4. Readme (este archivo).  

> **Integración con backend, firmado digital y PWA se realizará en fase 2.**
```

---

###  
| Elemento | Detalle |
|----------|---------|
| **Vistas** | `.view.ts` (sin selector, solo páginas) |
| **Componentes** | `.component.ts` (reutilizables) |
| **Módulos** | Solo 3: `public`, `auth`, `admin` |
| **Rutas** | Lazy-loading por módulo, vistas internas |
| **Estilo** | TailwindCSS únicamente (sin `.scss` propios) |
| **Colores** | Gris general, **solo botones azules** |

---
