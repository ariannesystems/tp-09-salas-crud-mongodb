const express = require("express");
const { validarReservas } = require("../middleware/reservas");

function crearRouterReservasApi(controlador) {
  const router = express.Router();

  router.get("/", controlador.listarApi);
  router.get("/:id", controlador.obtenerApi);
  router.post("/", validarReservas, controlador.crearApi);
  router.delete("/:id", controlador.eliminarApi);
  return router;
}
module.exports = { crearRouterReservasApi };
