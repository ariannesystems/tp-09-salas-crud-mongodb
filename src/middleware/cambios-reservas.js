function validarReemplazoReserva(req, res, next) {
  const datos = req.body;
  const permitidos = [
    "estudiante",
    "email",
    "sala",
    "fecha",
    "turno",
    "personas",
    "estado",
  ];
  for (const campo of Object.keys(datos)) {
    if (!permitidos.includes(campo)) {
      return res.status(400).json({ error: "El campo " + campo + " no se puede modificar." });
    }
  }
  if (typeof datos.estado !== "boolean") {
    return res.status(400).json({ error: "Estado debe ser true o false." });
  }
  req.cambiosValidos = req.reservaValidada;
  req.cambiosValidos.estado = datos.estado;
  next();
}
module.exports = { validarReemplazoReserva };
