# Reserva CRUD

| |                                                     |
| --- |-----------------------------------------------------|
| **Status** | Pending                                      |
| **Date** | 09/28/2026                                          |
| **Scope** | `libraryapp-frntnd`              |
| **Reference** | `Cliente` and `Reserva` screen (frontend) |

# Part 1 - Specification

## Global

Implements a complete search for cliente and reserva defined in *.ts following the patterns used in this project.


## Scope

In scope:

* Frontend screen: implement the search option defined in layout as a part of client and reserva.
* Route `/search` registered in the app routes.

Out of scope:
* Serach, reports, or any bulk operation.

## Data Model

Used atributes from reserva.ts and cliente.ts file avoid override this file, is it already to used

## contract 

```
// ReservaController @RequestMapping("/v1/reserva")
GET    /v1/search        -> 200 OK + ReservaDTO[] + ClienteDTO
GET    /v1/search/{id}   -> 200 OK + ReservaDTO + ClienteDTO
POST   /v1/search        -> 201 Created + Location header
PUT    /v1/search/{id}   -> 200 OK + ReservaDTO
DELETE /v1/search/{id}   -> 204 No Content
```

Request and response bodies are `application/json`. A missing id returns the project's standard not-found response.

## Expected Files

Fronted:

* `model/search.ts`
* `services/search.service.ts`
* `pages/search/search.component.{ts,html,css}`
* Route entry in `app/app.routes.ts` (`pages/search`)

## Acceptance Criteria

* [x] The five endpoints respond as described in the contract. — backend `SearchController` (`/v1/search`) implements all five; backend `mvn compile` passes. Not exercised live (backend was not started in this session).
* [x] Creating returns `201` with a `Location` header. — implemented in `SearchControllere`.
* [x] A missing id returns the standard not-found response. — `service.findByCliente` throws `ModelNotFoundException`, handled by `ResponseExceptionHandler` (same pattern as other controllers).
* [ ] The list screen shows reservas with filter, pagination and sorting. — implemented and type-checked by the AOT build; **not exercised in a browser** (no browser automation available in this session).
* [ ] The dialog creates and edits, and the list refreshes afterward. — implemented and type-checked by the AOT build; **not exercised in a browser**.
* [ ] The route renders the screen. — route `pages/searcha` registered plus a layout navigation entry; **not exercised in a browser**.
* [x] Backend compiles and frontend builds. — both verified, see Part 2.

> Implementation completed. Part 2 is included below with verification notes.

## Part 2 - Implementation notes

Added, following the `Search` screen pattern and without touching `model/reserva.ts` and `model/cliente.ts`:
