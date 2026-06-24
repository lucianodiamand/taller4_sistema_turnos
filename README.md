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
- Consola H2: http://localhost:8080/h2-console (ver [Base de datos (H2)](#base-de-datos-h2))

> **Secret de JWT.** La firma de los tokens usa `app.jwt.secret`, que se lee de la
> variable de entorno **`APP_JWT_SECRET`** y, si no está, cae a un default de
> desarrollo definido en `application.yml`. Para desarrollo no hace falta tocar nada.
> En producción, definila (mín. 32 caracteres) antes de arrancar:
>
> ```bash
> export APP_JWT_SECRET="una-cadena-larga-y-aleatoria-de-al-menos-32-caracteres"
> ./gradlew bootRun
> ```

### 2. Frontend

```bash
cd frontend
npm install      # solo la primera vez
npm start
```

App en http://localhost:4200 — muestra el estado del backend. El dev server proxya
`/api` hacia el backend (ver `frontend/proxy.conf.json`), así que no hay problemas
de CORS en desarrollo.

## Base de datos (H2)

La base es **H2 en archivo**: vive en `backend/data/sistematurnos.mv.db` y persiste
entre reinicios. Las tablas las crea Hibernate solo al levantar el backend
(`ddl-auto: update`), así que **no hace falta ningún script de schema**. Por ahora
arranca vacía (sin datos semilla).

### Inspeccionarla con la consola H2

1. Levantá el backend (`./gradlew bootRun`).
2. Abrí http://localhost:8080/h2-console.
3. Completá el formulario de login con **estos** valores (el default que trae,
   `jdbc:h2:mem:testdb`, es otra base en memoria — hay que reemplazarlo):

   | Campo        | Valor                                              |
   | ------------ | -------------------------------------------------- |
   | Driver Class | `org.h2.Driver`                                    |
   | JDBC URL     | `jdbc:h2:file:./data/sistematurnos;AUTO_SERVER=TRUE` |
   | User Name    | `sa`                                               |
   | Password     | *(vacío)*                                          |

4. **Connect**.

> **`AUTO_SERVER=TRUE` es lo que permite conectarse mientras el backend está
> corriendo** (varias conexiones sobre el mismo archivo). Sin eso, H2 toma un lock
> exclusivo y la consola falla con *"Database may be already in use"*. Es el mismo
> motivo por el que el `spring.datasource.url` del backend ya lo incluye.

### Para empezar de cero

Apagá el backend y borrá los archivos de la base; se regeneran vacíos al próximo
arranque:

```bash
rm backend/data/sistematurnos.mv.db backend/data/sistematurnos.lock.db
```

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
