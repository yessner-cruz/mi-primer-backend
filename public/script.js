async function conectarConBackend() {
  try {
    const respuesta = await fetch('/api/saludo?llave=Casimiro2026');

    if (!respuesta.ok) {
      document.getElementById('resultado').innerText =
        `Error ${respuesta.status}: No autorizado`;
      return;
    }

    const datos = await respuesta.json();

    console.log("Respuesta recibida:", datos);

    document.getElementById('resultado').innerText = datos.mensaje2;

  } catch (error) {
    console.error("Error al conectar con el servidor:", error);
    document.getElementById('resultado').innerText =
      "Error al conectar con el servidor";
  }
}