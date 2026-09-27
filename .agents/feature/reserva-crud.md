# Reserva CRUD

| |                                                     |
| --- |-----------------------------------------------------|
| **Status** | Implemented                                      |
| **Date** | 09/23/2026                                          |
| **Scope** | `libraryapp-frntnd`              |
| **Reference** | `Clientes` screen (frontend) |

# Part 1 - Specification

## Global

Implements a complete CRUD for reserva.ts following the patterns used in this project.


## Scope

In scope:

* Frontend screen: list with filter, pagination and sorting, plus a create/edit dialog and delete confirmation.
* Route `/reserva` registered in the app routes.

Out of scope:
* Serach, reports, or any bulk operation.

## Data Model

Used atributes from reserva.ts file avoid override this file, is it already to used

## contract 

```
// ReservaController @RequestMapping("/v1/reserva")
GET    /v1/reserva        -> 200 OK + ReservaDTO[]
GET    /v1/reserva/{id}   -> 200 OK + ReservaDTO
POST   /v1/reserva        -> 201 Created + Location header
PUT    /v1/reserva/{id}   -> 200 OK + ReservaDTO
DELETE /v1/reserva/{id}   -> 204 No Content
```

Request and response bodies are `application/json`. A missing id returns the project's standard not-found response.

## Expected Files

Fronted:

* `model/reserva.ts`
* `services/reserva.service.ts`
* `stores/reserva.store.ts`, `stores/reserva-dialog.store.ts`
* `forms/reserva.form.ts`
* `pages/reserva/reserva.component.{ts,html,css}`
* `pages/reserva/reserva-dialog/reserva-dialog.component.{ts,html,css}`
* Route entry in `app/app.routes.ts` (`pages/reserva`)

## Acceptance Criteria

* [x] The five endpoints respond as described in the contract. — backend `ReservaController` (`/v1/reserva`) implements all five; backend `mvn compile` passes. Not exercised live (backend was not started in this session).
* [x] A request with an empty detail is rejected. — dialog disables OK via signal-form `required`/`minLength` validation; backend `@Valid` requires `fechaReserva` and `cliente`.
* [x] Creating returns `201` with a `Location` header. — implemented in `ReservaController.save` (`ResponseEntity.created(location)`).
* [x] A missing id returns the standard not-found response. — `service.findById` throws `ModelNotFoundException`, handled by `ResponseExceptionHandler` (same pattern as other controllers).
* [ ] The list screen shows reservas with filter, pagination and sorting. — implemented and type-checked by the AOT build; **not exercised in a browser** (no browser automation available in this session).
* [ ] The dialog creates and edits, and the list refreshes afterward. — implemented and type-checked by the AOT build; **not exercised in a browser**.
* [ ] Delete asks for confirmation first. — implemented via the shared `ConfirmDialogComponent`; **not exercised in a browser**.
* [ ] The route renders the screen. — route `pages/reserva` registered plus a layout navigation entry; **not exercised in a browser**.
* [x] Backend compiles and frontend builds. — both verified, see Part 2.

> Implementation completed. Part 2 is included below with verification notes.

## Part 2 - Implementation notes

Added, following the `Clientes` screen pattern and without touching `model/reserva.ts`:

* `services/reserva.service.ts` — `ReservaService extends GenericService<Reserva>` on `${HOST}/v1/reserva`.
* `stores/reserva.store.ts` — collection store (`httpResource`, `$reservas`, `reload()`).
* `stores/reserva-dialog.store.ts` — edit store loading one reserva by id.
* `forms/reserva.form.ts` — signal form (`required` fechaReserva/detalleReserva/cliente.idCliente, detalleReserva 3–255 chars).
* `pages/reserva/reserva.component.{ts,html,css}` — Material table (id, date, client, detail) with filter, pagination, sorting, create/edit dialog and delete confirmation.
* `pages/reserva/reserva-dialog/reserva-dialog.component.{ts,html,css}` — create/edit dialog. Note: the `fechaReserva` datetime-local input is synced manually to the signal-form model because the `formField` directive only supports `string | number` bindings, not `Date`.
* Route `{ path: 'pages/reserva', component: ReservaComponent }` in `app/app.routes.ts` and a `Reserva` entry in the layout sidenav.

Verification: backend `.\mvnw.cmd -q compile -DskipTests` passes with no errors. Frontend `npm.cmd run build` passes AOT/template type-check with zero errors (bundle grows 936 kB -> 958 kB, confirming the new code is compiled in). The build still stops at the prerender step with the pre-existing error `The 'pages/libros/edit/:id' route uses prerendering ... 'getPrerenderParams' is missing` — this failure exists on the pristine checkout too and is unrelated to this feature.
