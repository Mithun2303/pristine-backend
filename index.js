const app = require("express")();
const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");
const { middleware } = require("./middleware/middleware");
const authorization = require("./middleware/authorization");

const authentication = require("./routes/auth");
// const foodRoutes = require("./controllers/food");

// const swaggerJsdoc = require("swagger-jsdoc");
// const swaggerUi = require("swagger-ui-express");
// const options = {
//     definition: {
//         openapi: "3.1.0",
//         info: {
//             title: "LogRocket Express API with Swagger",
//             version: "0.1.0",
//             description:
//                 "This is a simple CRUD API application made with Express and documented with Swagger",
//             license: {
//                 name: "MIT",
//                 url: "https://spdx.org/licenses/MIT.html",
//             },
//             contact: {
//                 name: "LogRocket",
//                 url: "https://logrocket.com",
//                 email: "info@email.com",
//             },
//         },
//         servers: [
//             {
//                 url: "http://127.0.0.1:8000",
//             },
//         ],
//     },
//     apis: ["./routes/*.js"],
// };

// const specs = swaggerJsdoc(options);


app.use(cors({
    origin: ['http://127.0.0.1:3000'],
    credentials: true
}));
app.use(express.json());
app.use(bodyParser.json());
app.use('/api/auth',middleware, authentication);
// app.use('/api/food', foodRoutes);
// app.use('/api/password', passRoutes);

// app.use(
//     "/api/docs",
//     swaggerUi.serve,
//     swaggerUi.setup(specs,{
//         explorer:true
//     })
// );
app.listen(8000, () => {
    console.log("Listening on port 8000");
})
