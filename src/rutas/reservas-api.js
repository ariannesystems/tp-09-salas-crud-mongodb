const express = require("express");
const { validarReservas } = require("../middleware/reservas");

function crearRouterReservasApi(controlador) {

    const router = express.Router();
    
    router.get("/", controlador.listarApi);
    router.get("/:id", controlador.obtenerApi);
    router.post("/", validarReservas, controlador.crearApi);
    
    return router;
}
module.exports = { crearRouterReservasApi };