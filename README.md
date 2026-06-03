# Sistema de Turnos

Sistema de turnos para **múltiples servicios y profesionales**. Permite la gestión
desde dos lados:

- **Cliente**: reserva y administra sus propios turnos.
- **Profesional / Admin**: gestiona la agenda, los servicios y los turnos.

> Estado actual: **esqueleto inicial**. Backend y frontend levantan y se comunican
> a través de un endpoint de diagnóstico (`/api/health`). Las entidades de dominio,
> la autenticación JWT y las vistas se incorporan en etapas posteriores.

## Stack

| Capa      | Tecnología                                             |
| --------- | ------------------------------------------------------ |
| Backend   | Java 21 · Spring Boot 3.5.3 · Gradle                   |
| ORM / DB  | Spring Data JPA (Hibernate) · H2 en archivo (→ PostgreSQL a futuro) |
| API docs  | springdoc-openapi (OpenAPI 3 + Swagger UI)             |
| Frontend  | Angular 21 (standalone, signals, zoneless)             |
| Tipos     | orval — genera cliente y tipos TS desde el OpenAPI del backend |

## Estructura

```
taller4_sistema_turnos/
├── backend/    # Spring Boot (API REST en :8080)
└── frontend/   # Angular 21 (dev server en :4200, proxy /api → :8080)
```

## Requisitos

- **JDK 21** (gestionado con [mise](https://mise.jdx.dev): el `mise.toml` del repo
  fija Java 21; el wrapper de Gradle se descarga solo, no hace falta instalar Gradle)
- **Node.js 20+** y **npm**
- **Angular CLI 21** (`npm i -g @angular/cli`)

## Cómo levantarlo

### 1. Backend

```bash
cd backend
./gradlew bootRun
```

- API: http://localhost:8080/api/health
- Swagger UI: http://localhost:8080/swagger-ui.html
- Consola H2: http://localhost:8080/h2-console
  (JDBC URL: `jdbc:h2:file:./data/sistematurnos`, usuario `sa`, sin contraseña)

### 2. Frontend

```bash
cd frontend
npm install      # solo la primera vez
npm start
```

App en http://localhost:4200 — muestra el estado del backend. El dev server proxya
`/api` hacia el backend (ver `frontend/proxy.conf.json`), así que no hay problemas
de CORS en desarrollo.

## Tipos compartidos backend ↔ frontend

Los tipos del frontend **no se escriben a mano**: se generan desde el esquema OpenAPI
que expone el backend. Con el backend corriendo:

```bash
cd frontend
npm run gen:api
```

Esto regenera `frontend/src/app/core/api/generated/` (cliente Angular + interfaces TS).
Flujo de propagación: **DTO Java → OpenAPI → orval → servicio/tipos TS**. Cada vez que
cambie un DTO o endpoint en el backend, volvé a correr `npm run gen:api`.

## Próximos pasos

- Entidades de dominio (Usuario, Profesional, Servicio, Turno, Disponibilidad…).
- Autenticación JWT con roles **ADMIN / PROFESIONAL / CLIENTE**
  (la dependencia `jjwt` ya está incluida; `SecurityConfig` es permisivo por ahora).
- Migración de H2 a PostgreSQL. (De ser necesario)
