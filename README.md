# TABAJO PRACTICO Nro 09 -- Actualización y eliminación de reservas de salas

Proyecto realizado a partir de una copia funcional del **TABAJO PRACTICO Nro 08**,
ampliada para completar el CRUD de reservas con Node.js, Express y
MongoDB.

## Requisitos y entorno

- **Node.js:** 24.19.0.
- **npm:** 12.2.1
- **Base de datos:** MongoDB Atlas.
- **Base:** `reservas_salas_u9`
- **Colección:** `reservas`
- **DNS:** se conserva la configuración externa y el ajuste DNS
  autorizado del TP 08. No se incluyen credenciales ni la URI real.
- **Puerto local:** `3000`.

Para preparar el proyecto, instalar las dependencias y crear un archivo
`.env` privado a partir de la plantilla del proyecto. Configurar allí la
conexión a Atlas sin subir secretos al repositorio.

## Inicio y calidad

```bash
npm install
npm start
```

Los comandos de formato y análisis deben ejecutarse con los scripts
definidos en `package.json`:

```bash
npm run format
npm run check
```

## Organización por capas

- **Rutas:** reciben las solicitudes HTTP y las dirigen al
  middleware/controlador correspondiente.
- **Middleware y validaciones:** comprueban los datos recibidos y
  rechazan entradas inválidas.
- **Controladores:** gestionan la solicitud y construyen la respuesta
  HTTP.
- **Servicios:** aplican las operaciones de negocio y preparan los
  datos que se consultan o modifican.
- **Modelo:** define el esquema de Mongoose y la interacción con
  MongoDB.
- **Vistas y archivos públicos:** mantienen el formulario, el listado,
  el detalle y la ruta `/estado`.

Ajuste de los nombres de las capas a los archivos reales del repositorio.

## API

---

Método Ruta Comportamiento esperado

---

`POST` `/api/reservas` Crea una reserva;
responde `201`, incluye
`Location` y asigna
`estado: "pendiente"`
por defecto. El cliente
no puede enviar
`estado` ni `_id`.

`GET` `/api/reservas` Devuelve `200` con un
arreglo de reservas,
sin metadatos
adicionales.

`GET` `/api/reservas/:id` Devuelve `200` con la
reserva o `404` si no
existe.

`PUT` `/api/reservas/:id` Reemplaza la reserva
completa. Exige los
siete campos editables
y conserva el mismo ID.

`PATCH` `/api/reservas/:id` Modifica parcialmente
solo `personas` y/o
`estado`. Debe incluir
al menos uno de esos
campos y conservar los
demás.

`DELETE` `/api/reservas/:id` Elimina físicamente una
reserva. Responde `204`
sin cuerpo; si no
existe, responde `404`.

---

Los IDs mal formados deben responder `400`. Las entradas inválidas deben
responder `400` sin modificar datos. Los fallos inesperados deben
responder `500` sin exponer trazas ni secretos. Las actualizaciones no
crean documentos si el ID no existe.

## Reglas de validación

- `estudiante`: texto obligatorio, sin espacios al inicio o al final.
- `email`: texto obligatorio, sin espacios al inicio o al final y con
  `@`.
- `sala`: `Sala Norte`, `Sala Sur` o `Sala Multimedia`.
- `fecha`: texto obligatorio, sin espacios al inicio o al final.
- `turno`: `Mañana`, `Tarde` o `Noche`.
- `personas`: número entero entre `1` y `6`.
- `estado`: `pendiente` o `confirmada`; al crear, el valor
  predeterminado es `pendiente`.

En `PUT`, todos los campos editables son obligatorios. En `PATCH`, solo
se aceptan `personas` y `estado`, y debe enviarse al menos uno. Ambos
rechazan campos desconocidos, `_id`, operadores enviados por el cliente,
cuerpos ausentes, arreglos y objetos como valores numéricos. Para
`personas` se admite un número o un texto numérico no vacío, siempre que
sea finito, entero y esté entre 1 y 6.

No se validan calendario, disponibilidad, solapamientos, cupos
compartidos ni unicidad. Cambiar el estado a `confirmada` es una
decisión explícita; no comprueba esas condiciones.

## Pruebas con Postman

Usar `http://localhost:3000` como URL base (ajustar el puerto si
corresponde). Para `POST`, `PUT` y `PATCH`, seleccionar **Body → raw →
JSON** y enviar `Content-Type: application/json`. Para `GET` y `DELETE`,
dejar el cuerpo en `none`.

Recorrido mínimo recomendado:

1.  Crear una reserva con `POST /api/reservas` y guardar el ID y el
    encabezado `Location`.
2.  Consultar la reserva con `GET /api/reservas/:id`.
3.  Enviar un `PUT` completo y verificar `200`, el mismo ID y los siete
    campos.
4.  Enviar un `PUT` incompleto y comprobar `400` sin cambios.
5.  Enviar `PATCH` con `{"personas": 3}` y verificar que los demás
    campos se conserven. Probar también el cambio de `estado`.
6.  Probar valores inválidos para `personas`, `estado`, campos extra,
    `_id`, operadores y cuerpo vacío.
7.  Eliminar únicamente una reserva de prueba con
    `DELETE /api/reservas/:id`; comprobar `204` sin cuerpo, luego `404`
    al consultar ese ID y una reserva menos en el listado.
8.  Probar un ID mal formado (`400`) y un ID válido inexistente (`404`).

## Matriz de pruebas observadas

## Matriz de pruebas observadas

| Prueba                         | Resultado observado                                  | Evidencia                   |
| ------------------------------ | ---------------------------------------------------- | --------------------------- |
| POST válido                    | Aprobado: `201`, `Location` y estado `pendiente`.    | Respuesta de Postman        |
| PUT completo                   | Aprobado: `200` y mismo ID.                          | Respuesta de Postman        |
| PUT incompleto                 | Aprobado: `400`, sin modificar la reserva.           | Respuesta de Postman        |
| PATCH válido                   | Aprobado: `200`; los campos omitidos se conservaron. | Respuesta de Postman        |
| Validaciones inválidas         | Aprobado: `400`, sin cambios en los datos.           | Respuestas de Postman       |
| ID mal formado y ID ausente    | Aprobado: `400` y `404`, respectivamente.            | Respuestas de Postman       |
| DELETE existente               | Aprobado: `204`, sin cuerpo de respuesta.            | Respuesta de Postman        |
| Segundo DELETE y GET posterior | Aprobado: `404` en ambos casos.                      | Respuestas de Postman       |
| Sitio, formulario y `/estado`  | Aprobado: funcionamiento correcto.                   | Capturas del navegador      |
| Error inesperado               | Aprobado: `500` sin exponer información sensible.    | Evidencia de prueba aislada |

## Persistencia y criterio de borrado

Después de actualizar una reserva, guardar su ID y los valores
resultantes, reiniciar el servidor y volver a consultarla. Los cambios
deben mantenerse en MongoDB. Repetir la comprobación con una reserva
eliminada: debe seguir ausente tras el reinicio.

El borrado es **físico y por ID**: elimina solo el documento
seleccionado. Un segundo `DELETE` y una consulta posterior deben
devolver `404`. No se agrega una marca de borrado ni una ruta para
vaciar la colección. No eliminar datos del TP 08 ni vaciar la colección
para preparar las pruebas.

## Alcance

Este trabajo mantiene la lectura simple, el formulario y las vistas
anteriores, además de las operaciones de actualización y eliminación. No
incluye autenticación ni despliegue público.

---
