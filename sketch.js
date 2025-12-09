const supabasePublicClient = supabase.createClient(
  "https://aakweawfdmkjoogumyhe.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFha3dlYXdmZG1ram9vZ3VteWhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MTQ3MTIsImV4cCI6MjA3NzQ5MDcxMn0.Rj3xmhH-n5k2QzDYsBNXyLVHBkW6dZgFIkfVM8Ix1iM",
  { db: { schema: "public" } }
);

document.addEventListener("DOMContentLoaded", () => {

  if (document.title.includes("Anuncios")) {
    const form = document.querySelector(".form-anuncio");

    form?.addEventListener("submit", async (e) => {
      e.preventDefault();

      const titulo = form.querySelector("input").value.trim();
      const descripcion = form.querySelector("textarea").value.trim();

      if (!titulo || !descripcion) return alert("Completa todo.");

      const { data, error } = await supabasePublicClient
        .from("ejeIntegrador")
        .insert([
          {
            Titulo: titulo,
            Descripcion: descripcion,
            Nombre: "Anónimo",
            Mensaje: null,
            Producto: null,
            Descripcion2: null,
          },
        ])
        .select();

      if (error) {
        console.error(error);
        alert("Error al publicar");
      } else {
        alert("¡Publicado!");
        form.reset();
      }
    });
  }

  if (document.title.includes("Social")) {
    const socialForm = document.querySelector(".form-anuncio");
    const socialFeed = document.getElementById("social-feed");

    async function cargarMensajes() {
      const { data, error } = await supabasePublicClient
        .from("ejeIntegrador")
        .select("Nombre, Mensaje")
        .order("id", { ascending: false });

      if (error) {
        console.error(error);
        socialFeed.innerHTML = "<p>Error al cargar.</p>";
        return;
      }

      if (!data.length) {
        socialFeed.innerHTML = "<p>No hay mensajes aún.</p>";
        return;
      }

      socialFeed.innerHTML = data
        .filter((m) => m.Mensaje)
        .map(
          (m) => `
        <div class="post">
          <h3>${m.Nombre || "Anónimo"}</h3>
          <p>${m.Mensaje}</p>
        </div>`
        )
        .join("");
    }

    cargarMensajes();

    socialForm?.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nombre = document.getElementById("nombre").value.trim();
      const mensaje = document.getElementById("mensaje").value.trim();

      if (!nombre || !mensaje) return alert("Completa todo.");

      const { data, error } = await supabasePublicClient
        .from("ejeIntegrador")
        .insert([{ Nombre: nombre, Mensaje: mensaje }])
        .select();

      if (error) {
        console.error(error);
        alert("Error al publicar");
        return;
      }

      const nuevo = data[0];
      const div = document.createElement("div");
      div.classList.add("post");
      div.innerHTML = `<h3>${nuevo.Nombre}</h3><p>${nuevo.Mensaje}</p>`;
      socialFeed.prepend(div);

      socialForm.reset();
      alert("¡Publicado!");
    });
  }

  if (document.title.includes("Comercio")) {
    const comercioForm = document.querySelector(".form-anuncio");
    const comercioFeed = document.getElementById("comercio-feed");

    async function cargarProductos() {
      const { data, error } = await supabasePublicClient
        .from("ejeIntegrador")
        .select("Producto, Descripcion2")
        .order("id", { ascending: false });

      if (error) {
        console.error(error);
        comercioFeed.innerHTML = "<p>Error al cargar.</p>";
        return;
      }

      if (!data.length) {
        comercioFeed.innerHTML = "<p>No hay productos aún.</p>";
        return;
      }

      comercioFeed.innerHTML = data
        .filter((p) => p.Producto && p.Descripcion2)
        .map(
          (p) => `
        <div class="post">
          <h3>${p.Producto}</h3>
          <p>${p.Descripcion2}</p>
        </div>`
        )
        .join("");
    }

    cargarProductos();

    comercioForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const producto = document.getElementById("producto").value.trim();
      const descripcion = document.getElementById("descripcion").value.trim();

      if (!producto || !descripcion) return alert("Completa todo.");

      const { data, error } = await supabasePublicClient
        .from("ejeIntegrador")
        .insert([{ Producto: producto, Descripcion2: descripcion }])
        .select();

      if (error) {
        console.error(error);
        alert("Error al publicar");
        return;
      }

      const nuevo = data[0];
      const div = document.createElement("div");
      div.classList.add("post");
      div.innerHTML = `<h3>${nuevo.Producto}</h3><p>${nuevo.Descripcion2}</p>`;
      comercioFeed.prepend(div);

      comercioForm.reset();
      alert("¡Publicado!");
    });
  }

  if (document.title.includes("Index")) {
    const indexFeed = document.getElementById("index-feed");
    if (!indexFeed) return;

    async function cargarAnunciosIndex() {
      const { data, error } = await supabasePublicClient
        .from("ejeIntegrador")
        .select("Titulo, Descripcion")
        .order("id", { ascending: false });

      if (error) {
        console.error(error);
        indexFeed.innerHTML = "<p>Error al cargar.</p>";
        return;
      }

      if (!data.length) {
        indexFeed.innerHTML = "<p>No hay anuncios todavía.</p>";
        return;
      }

      indexFeed.innerHTML = data
        .filter((a) => a.Titulo && a.Descripcion)
        .map(
          (a) => `
        <div class="post">
          <h3>${a.Titulo}</h3>
          <p>${a.Descripcion}</p>
        </div>`
        )
        .join("");
    }

    cargarAnunciosIndex();
  }
});

 