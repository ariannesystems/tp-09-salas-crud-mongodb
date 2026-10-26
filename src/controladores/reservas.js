function crearControladorReservas(servicio) {
  async function listar(req, res) {
    const reservas = await servicio.listar();
    res.render("reservas/lista", {
      titulo: "Listas de reservas",
      reservas,
    });
  }

  function mostrarFormulario(req, res) {
    res.render("reservas/nueva", {
      titulo: "Nueva Reservas",
      error: null,
      valores: {},
    });
  }

  async function mostrarDetalle(req, res) {
    const reserva = await servicio.obtenerPorId(req.params.id);
    if (!reserva) {
      return res.status(404).render("no-encontrado", {
        titulo: "Reserva no encontrada",
        mensaje: "No existe una reserva con ese identificador.",
      });
    }
    res.render("reservas/detalle", { titulo: reserva.estudiante, reserva });
  }

  async function crear(req, res) {
    await servicio.crear(req.reservaValidada);
    res.redirect("/reservas");
  }

  async function listarApi(req, res) {
    const reservas = await servicio.listar(req.query.sala);
    res.json(reservas);
  }

  async function obtenerApi(req, res) {
    const reserva = await servicio.obtenerPorId(req.params.id);
    if (!reserva) {
      return res.status(404).json({ error: "Reserva no encontrada." });
    }
    res.json(reserva);
  }

  async function crearApi(req, res) {
    const reserva = await servicio.crear(req.reservaValidada);
    res.location(`/api/reservas/${reserva.id}`).status(201).json(reserva);
  }
  return {
    listar,
    mostrarFormulario,
    mostrarDetalle,
    crear,
    listarApi,
    obtenerApi,
    crearApi,
  };
}
module.exports = { crearControladorReservas };
