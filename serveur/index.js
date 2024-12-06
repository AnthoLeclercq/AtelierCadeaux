const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const path = require('path')

const http = require("http") // Importez le module http de Node.js
const socketIo = require("socket.io") // Importez Socket.IO
const os = require('os');

const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/user.route")
const productRoutes = require("./routes/product.route")
const productMetaRoutes = require("./routes/productMeta.route")
const cartRoutes = require("./routes/cart.route")
const orderRoutes = require("./routes/order.route")
const favoriteRoutes = require("./routes/favorite.route");
const metaRoutes = require("./routes/meta.route");
const imageRoutes = require('./routes/image.route');
const discussionsRoutes = require("./routes/discussions.route")
const updateDiscussion = require("./controllers/discussions.controller")
const commentRoutes = require("./routes/comment.route")
const resetPasswordRoutes = require("./routes/resetPassword.route")
const elasticsearchRoutes = require("./routes/elasticsearch.route")
const alfredRoutes = require('./routes/alfred.route');
const mlRoutes = require('./routes/ml.route');

const app = express()
const server = http.createServer(app) // Créez un serveur HTTP à partir de votre application Express
const io = socketIo(server) // Initialisez Socket.IO en utilisant le serveur HTTP

require("dotenv").config()

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to our API!" })
})

app.get("/close", (req, res) => {
  console.log("Exiting NodeJS server")
  process.exit()
})


// Gestion des routes CRUD
app.use("/auth", authRoutes)
app.use("/user", userRoutes)
app.use("/product", productRoutes)
app.use("/productMeta", productMetaRoutes)
app.use("/cart", cartRoutes)
app.use("/order", orderRoutes)
app.use("/favorite", favoriteRoutes)
app.use("/meta", metaRoutes)
app.use("/comment", commentRoutes)
app.use("/password", resetPasswordRoutes)
app.use("/elasticsearch", elasticsearchRoutes)
app.use('/alfred', alfredRoutes);
app.use('/ml', mlRoutes);

// Gestion des routes Stockage
app.use("/image", imageRoutes)
app.use("/discussions", discussionsRoutes)

// Configuration pour servir des fichiers statiques
app.use('/images', express.static(path.join(__dirname, 'images')));

// Gestion des connexions Socket.IO
io.on("connection", (socket) => {
  console.log("A user connected", socket.id)
  socket.on("disconnect", () => {
    console.log("User disconnected")
  })
  socket.on("chatMessage", (data) => {
    updateDiscussion(data)
    socket.broadcast.emit("Message", data.message)
  })
})

// Fonction pour afficher les adresses IP locales
const getLocalIPs = () => {
  const networkInterfaces = os.networkInterfaces();
  const ipAddresses = Object.keys(networkInterfaces)
    .map((iface) =>
      networkInterfaces[iface].find((address) => address.family === 'IPv4' && !address.internal)
    )
    .filter(Boolean)
    .map((address) => address.address);
  
  return ipAddresses;
};

server.listen(process.env.PORT || 3000, () => {
  const ipAddresses = getLocalIPs();
  console.log(`App running on port ${process.env.PORT || 3000}...`);
  ipAddresses.forEach(ip => {
    console.log(`App accessible at: http://${ip}:${process.env.PORT || 3000}`);
  });
})

module.exports = app;
