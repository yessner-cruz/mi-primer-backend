async function conectarConBackend() {
  try {
    const respuesta = await fetch('/api/saludo');
    const datos = await respuesta.json();

    console.log("Respuesta recibida:", datos);

    document.getElementById('resultado').innerText = datos.mensaje;

  } catch (error) {
    console.error("Error al conectar con el servidor:", error);
  }
}