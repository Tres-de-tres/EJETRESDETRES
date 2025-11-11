// =====================================================
// 🔗 CONFIGURACIÓN DE SUPABASE
// =====================================================
const supabasePublicClient = supabase.createClient(
  "https://aakweawfdmkjoogumyhe.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFha3dlYXdmZG1ram9vZ3VteWhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MTQ3MTIsImV4cCI6MjA3NzQ5MDcxMn0.Rj3xmhH-n5k2QzDYsBNXyLVHBkW6dZgFIkfVM8Ix1iM",
  { db: { schema: "public" } }
);

// =====================================================
// 🔁 ESPERAR CARGA DEL DOM
// =====================================================
document.addEventListener("DOMContentLoaded", () => {

  // =====================================================
  // 🟢 SECCIÓN: ANUNCIOS.HTML
  // =====================================================
  if (document.title.includes("Anuncios")) {
    const form = document.querySelector(".form-anuncio");

    form?.addEventListener("submit", async (e) => {
      e.preventDefault();

      const titulo = form.querySelector("input").value.trim();
      const descripcion = form.querySelector("textarea").value.trim();

      if (!titulo || !descripcion) {
        alert("Por favor, completa todos los campos.");
        return;
      }

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
        console.error("❌ Error al publicar el anuncio:", error);
        alert("Error al publicar: " + error.message);
      } else {
        console.log("✅ Anuncio publicado:", data);
        alert("✅ ¡Anuncio publicado correctamente!");
        form.reset();
      }
    });
  }

  // =====================================================
  // 🟣 SECCIÓN: SOCIAL.HTML
  // =====================================================
  if (document.title.includes("Social")) {
    const socialForm = document.querySelector(".form-anuncio");
    const socialFeed = document.getElementById("social-feed");

    async function cargarMensajes() {
      const { data, error } = await supabasePublicClient
        .from("ejeIntegrador")
        .select("Nombre, Mensaje")
        .order("id", { ascending: false });

      if (error) {
        console.error("Error al cargar mensajes:", error);
        socialFeed.innerHTML = "<p>Error al cargar los mensajes.</p>";
        return;
      }

      if (!data || data.length === 0) {
        socialFeed.innerHTML = "<p>No hay mensajes aún. ¡Sé el primero en publicar!</p>";
        return;
      }

      socialFeed.innerHTML = data
        .filter((msg) => msg.Mensaje)
        .map(
          (msg) => `
          <div class="post">
            <h3>${msg.Nombre || "Anónimo"}</h3>
            <p>${msg.Mensaje}</p>
          </div>
        `
        )
        .join("");
    }

    cargarMensajes();

    socialForm?.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nombre = document.getElementById("nombre").value.trim();
      const mensaje = document.getElementById("mensaje").value.trim();

      if (!nombre || !mensaje) {
        alert("Por favor, completa todos los campos.");
        return;
      }

      const { data, error } = await supabasePublicClient
        .from("ejeIntegrador")
        .insert([{ Nombre: nombre, Mensaje: mensaje }])
        .select();

      if (error) {
        console.error("❌ Error al publicar mensaje:", error);
        alert("Error al publicar el mensaje.");
        return;
      }

      const nuevo = data[0];
      const nuevoPost = document.createElement("div");
      nuevoPost.classList.add("post");
      nuevoPost.innerHTML = `<h3>${nuevo.Nombre}</h3><p>${nuevo.Mensaje}</p>`;
      socialFeed.prepend(nuevoPost);

      socialForm.reset();
      alert("✅ ¡Mensaje publicado!");
    });
  }

  // =====================================================
  // 🟠 SECCIÓN: COMERCIO.HTML
  // =====================================================
  if (document.title.includes("Comercio")) {
    const comercioForm = document.querySelector(".form-anuncio");
    const comercioFeed = document.getElementById("comercio-feed");

    async function cargarProductos() {
      const { data, error } = await supabasePublicClient
        .from("ejeIntegrador")
        .select("Producto, Descripcion2")
        .order("id", { ascending: false });

      if (error) {
        console.error("❌ Error al cargar productos:", error);
        comercioFeed.innerHTML = "<p>Error al cargar los productos.</p>";
        return;
      }

      if (!data || data.length === 0) {
        comercioFeed.innerHTML = "<p>No hay productos aún. ¡Publica el primero!</p>";
        return;
      }

      comercioFeed.innerHTML = data
        .filter((item) => item.Producto && item.Descripcion2)
        .map(
          (item) => `
          <div class="post">
            <h3>🛍️ ${item.Producto}</h3>
            <p>${item.Descripcion2}</p>
          </div>
        `
        )
        .join("");
    }

    cargarProductos();

    comercioForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const producto = document.getElementById("producto").value.trim();
      const descripcion = document.getElementById("descripcion").value.trim();

      if (!producto || !descripcion) {
        alert("Por favor, completa todos los campos.");
        return;
      }

      const { data, error } = await supabasePublicClient
        .from("ejeIntegrador")
        .insert([{ Producto: producto, Descripcion2: descripcion }])
        .select();

      if (error) {
        console.error("❌ Error al publicar producto:", error);
        alert("Error al publicar el producto.");
        return;
      }

      const nuevo = data[0];
      const nuevoPost = document.createElement("div");
      nuevoPost.classList.add("post");
      nuevoPost.innerHTML = `<h3>🛍️ ${nuevo.Producto}</h3><p>${nuevo.Descripcion2}</p>`;
      comercioFeed.prepend(nuevoPost);

      comercioForm.reset();
      alert("✅ ¡Producto publicado!");
    });
  }

  // =====================================================
  // 🏠 SECCIÓN: INDEX.HTML
  // =====================================================
  if (document.title.includes("Index")) {
    const indexFeed = document.getElementById("index-feed");

    if (!indexFeed) return;

    async function cargarAnunciosIndex() {
      const { data, error } = await supabasePublicClient
        .from("ejeIntegrador")
        .select("Titulo, Descripcion")
        .order("id", { ascending: false });

      if (error) {
        console.error("❌ Error al cargar anuncios en index:", error);
        indexFeed.innerHTML = "<p>Error al cargar los anuncios.</p>";
        return;
      }

      if (!data || data.length === 0) {
        indexFeed.innerHTML = "<p>No hay anuncios publicados todavía.</p>";
        return;
      }

      indexFeed.innerHTML = data
        .filter((item) => item.Titulo && item.Descripcion)
        .map(
          (item) => `
          <div class="post">
            <h3>${item.Titulo}</h3>
            <p>${item.Descripcion}</p>
          </div>
        `
        )
        .join("");
    }

    cargarAnunciosIndex();
  }
});
