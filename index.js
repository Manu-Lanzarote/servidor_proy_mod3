//SERVIDOR

//Para crear un servidor lo primero que tendremos que hacer es instalar en el terminal varios paquetes:
// Node  ---    npm init -y
// Express ---   npm install express
// MongoDB ---    npm install mongodb     (Forma abreviada  ---  npm i express mongodb)

//Después debemos crear el archivo    index.js  (que es este)  y  aquí:

//Importamos express
const express = require("express");

//Importamos mongodb. Podemos hacerlo en dos pasos:
//const mongodb = require("mongodb")
//const MongoClient = mongodb.MongoClient
//O hacerlo directamente:
const MongoClient = require("mongodb").MongoClient;

//Creamos la variable App
const app = express();

//Creamos la variable db
let db;

//Y nos conectamos a la la base de datos
MongoClient.connect("mongodb://localhost:27017", function (err, client) {
  if (err !== null) {
    console.log(err);
  } else {
    db = client.db("inmersiones_lanzarote");
  }
});

//Hay que instalar CORS en el servidor -- en el terminal npm i cors   --- y después importarlo. Esto hay que hacerlo por que si no lo instalo, cuando hacemos fetch desde el cliente, la consola me va a tirar un error CORS "Access-Control-Allow-Origin" "Intercambio-de-recursos-de-origen-cruzado" CORS es un protocolo estandar que nos permite acceder a recursos de diferentes dominios, por ejemplo, los iconos o las fuentes externas, o los datos de APIs.

//npm i cors           en el terminal
const cors = require("cors");
app.use(cors());

//Y por últimno para que podamos pasar datos a través del body de los métodos POST, PUT y DELETE necesitamos:
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Y ya tenemos preparado nuestro servidor para pasar las rutas
//NO OLVIDAR CERRAR EL CÓDIGO  con     app.listen(3001)    (En este caso el localhost será el 3001 porque dejo el 3000 para React en el cliente)

//Crear el archivo .gitignore     /node_modules

//TENDREMOS QUE REPETIR ESTE PROCESO EN TODOS NUESTROS PROYECTOS

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//RUTAS GET, POST, PUT, DELETE
//SOBRE LA LÓGICA. Hay que ver qué es lo que se necesita del servidor en cada caso.

//En el caso de las rutas tipo GET, para obtener ls zonas sólo necesito indicarle qué coleccion, (zona de buceo) quiero obtener.

//En el caso de la ruta tipo POST, quiero añadir al servidor un objeto completo (una inmersión), por lo que sólo tengo que indicarle a qué colección voy a añadir el objeto (req.body.lugar) para enviarle el objeto completo (req.body)

//En el caso de la ruta tipo PUT, quiero modificar un objeto que ya existe por lo que tendré pasar al servidor un objeto completo con las modificaciones que quiero hacer. Por eso necesito enviar de nuevo todos los valores del objeto (inmersión) a excepción del lugar y del nombre, que obviamente no pueden cambiar.

//En el caso de la ruta tipo DELETE lo que le envío al servidor el lugar (req.body.lugar) y el nombre
//(req.body.nombre). (Pido también el lugar por que podría haber dos inmersiones con el mismo nombre que estubieran en diferentes lugares).

//Lanzarote tiene 4 zonas de buceo, así que crearé un app.get por cada una de ellas con su correspondiente ruta.
//Playa Blanca
app.get("/playablanca/", function (req, res) {
  db.collection("PLAYA BLANCA")
    .find()
    .toArray(function (err, datos) {
      if (err !== null) {
        res.send(err);
      } else {
        res.send(datos);
      }
    });
});
//Pruebo la ruta en postman: localhost:3001/playablanca/
//GET

//Mala
app.get("/mala/", function (req, res) {
  db.collection("MALA")
    .find()
    .toArray(function (err, datos) {
      if (err !== null) {
        res.send(err);
      } else {
        res.send(datos);
      }
    });
});
//Pruebo la ruta en postman: localhost:3001/mala/
//GET

//La graciosa
app.get("/lagraciosa/", function (req, res) {
  db.collection("LA GRACIOSA")
    .find()
    .toArray(function (err, datos) {
      if (err !== null) {
        res.send(err);
      } else {
        res.send(datos);
      }
    });
});
//Pruebo la ruta en postman: localhost:3001/lagraciosa/
//GET

//Puerto del Carmen
app.get("/puertodelcarmen/", function (req, res) {
  db.collection("PUERTO DEL CARMEN")
    .find()
    .toArray(function (err, datos) {
      if (err !== null) {
        res.send(err);
      } else {
        res.send(datos);
      }
    });
});
//Pruebo la ruta en postman: localhost:3001/puertodelcarmen/
//GET

//Ruta post para dar al usuario la posibilidad de AÑADIR nuevos puntos de inmersión
//En el caso de la ruta tipo POST, quiero añadir al servidor un objeto completo (una inmersión), por lo que sólo tengo que indicarle a qué colección voy a añadir el objeto (req.body.lugar) para enviarle el objeto completo (req.body)

app.post("/anyadir-inmersion/", function (req, res) {
  const nuevaInmersion = req.body;
  db.collection(req.body.lugar).insertOne(
    nuevaInmersion,
    function (err, datos) {
      if (err !== null) {
        res.send(err);
      } else {
        res.send(datos);
      }
    }
  );
});
//Pruebo la ruta en postman: localhost:3001/anyadir-inmersion/
//POST - Body - raw - JSON
//Para probar esta ruta copio uno de los objetos que obtengo a través de GET, le quito la ID y lo pego dentro del cuadro del JSON

//Ruta PUT para dar al usuario la posibilidad de MODIFICAR una inmersión
//En el caso de la ruta tipo PUT, quiero modificar un objeto que ya existe por lo que tendré pasar al servidor un objeto completo con las modificaciones que quiero hacer. Por eso necesito enviar de nuevo todos los valores del objeto (inmersión) a excepción del lugar y del nombre, que obviamente no pueden cambiar.

app.put("/editarInmersion/", function (req, res) {
  let editarInmersion = {
    imagen: req.body.imagen,
    lugar: req.body.lugar,
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    mapa: req.body.mapa,
    nivel: req.body.nivel,
    profundidad: req.body.profundidad,
    entrada: req.body.entrada,
    horario: req.body.horario,
    temperatura: req.body.temperatura,
  };
  db.collection(`${editarInmersion.lugar}`).updateOne(
    { nombre: editarInmersion.nombre },
    {
      $set: {
        imagen: editarInmersion.imagen,
        descripcion: editarInmersion.descripcion,
        mapa: editarInmersion.mapa,
        nivel: editarInmersion.nivel,
        profundidad: editarInmersion.profundidad,
        entrada: editarInmersion.entrada,
        horario: editarInmersion.horario,
        temperatura: editarInmersion.temperatura,
      },
    },
    function (err, datos) {
      if (err !== null) {
        res.send(err);
      } else {
        res.send(datos);
      }
    }
  );
});
//Pruebo la ruta en postman: localhost:3001/editarInmersion/
//PUT - Body - raw - JSON
//Para probar esta ruta copio uno de los objetos que obtengo a través de GET, le quito la ID y lo pego dentro del cuadro del JSON y cambio alguno de los datos que tieen el objeto para comprobar que se hacen los cambios.

//Ruta DELETE para borrar una inmersión
//En el caso de la ruta tipo DELETE lo que le envío al servidor el lugar (req.body.lugar) y el nombre
//(req.body.nombre). (Pido también el lugar por que podría haber dos inmersiones con el mismo nombre que estubieran en diferentes lugares).

app.delete("/borrarInmersion/", function (req, res) {
  let lugar = req.body.lugar;
  let nombre = req.body.nombre;
  db.collection(`${lugar}`).deleteOne(
    { nombre: nombre },
    function (err, datos) {
      if (err !== null) {
        res.send(err);
      } else {
        res.send(datos);
      }
    }
  );
});
//Pruebo la ruta en postman: localhost:3001/borrarInmersion/
//DELETE - Body - raw - JSON
//Para probar la ruta solo tengo que pasar el lugar y el nombre dentro del objeto.

//Ruta post para comprobar nombre de usuario y contraseña. CÓDIGO DE ANDER
//En el caso de la ruta tipo POST, quiero añadir al servidor un objeto completo con dos datos: nombre y usuario, por lo que sólo tengo que indicarle a qué colección voy a añadir el objeto (req.body.usuario) para enviarle el objeto completo (req.body)

app.post("/comprobar-usuario/", function (req, res) {
  const nuevoUsuario = req.body;
  db.collection("USUARIOS")
    .find({ usuario: req.body.usuario })
    .toArray(function (err, datos) {
      if (err !== null) {
        res.send(err);
      } else {
        if (datos.length > 0) {
          if (datos[0].contra === req.body.contra) {
            res.send(datos);
          } else {
            res.send({ error: true, mensaje: "Contraseña incorrecta" });
          }
        } else {
          res.send({ error: true, mensaje: "El usuario no existe" });
        }
      }
    });
});

//Pruebo la ruta en postman: localhost:3001/anyadir-inmersion/
//POST - Body - raw - JSON
//Para probar esta ruta copio uno de los objetos que obtengo a través de GET, le quito la ID y lo pego dentro del cuadro del JSON

//RECUERDA PROBAR TODAS LAS RUTAS  en postman para asegurarnos de que funcionan.
//Para ello hay que reiniciar el servidor en el terminal con      control C           y          node index.js

app.listen(3001);
