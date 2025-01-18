//Configuracion para las sesiones
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;
//npm install express express-session body-parser
//npm install express cors

// Habilita CORS para todas las rutas
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Configuración de express-session
app.use(
  session({
    secret: "mi_secreto_unico",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 600000 },
  })
);

// Middleware para analizar el cuerpo de la solicitud
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Sirve archivos estáticos desde la carpeta 'public'
app.use(express.static("../public"));

//Almacenar los datos del JSON en una constante

const products = require("../data/products.json");

// Rutas
app.get("/products", (req, res) => {
  res.json({ result: products });
});

app.post("/add-product", (req, res) => {
  const respuesta = { success: false };
  const id = req.body.id;
  const lista = products.products;

  if (!req.session.carrito) {
    req.session.carrito = [];
  }
  for (let index = 0; index < lista.length; index++) {
    if (index == id) {
      let exist = false;
      let producto = lista[index];
      for (let index = 0; index < req.session.carrito.length; index++) {
        if (req.session.carrito[index].nombre == producto.nombre) {
            console
          req.session.carrito[index].cantidad++;
          exist = true;
          break;
        }
      }

      if (!exist) {
        producto.id = id;
        req.session.carrito.push(producto);
      }

      respuesta.success = true;
      respuesta.carrito = req.session.carrito;
    }
  }

  console.log("hola");
  console.log(req.session.carrito);
  res.json(respuesta);
});

app.post("/remove-product", (req, res) => {
  let respuesta = { success: true };
  const id = req.body.idNew;
  for (let index = 0; index < req.session.carrito.length; index++) {
    console.log(req.session.carrito[index].id);
    console.log(id);
    if (req.session.carrito[index].id == id) {
      if (req.session.carrito[index].cantidad > 1) {
        req.session.carrito[index].cantidad--;
        respuesta.cantidad = req.session.carrito[index].cantidad;
      } else {
        req.session.carrito.splice(index, 1);
        respuesta.cantidad = 0;
      }
      break;
    }
  }

  res.json(respuesta);
});

app.post("/remove-all", (req, res) => {
  req.session.carrito = [];
  res.json({ success: true });
});



app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
