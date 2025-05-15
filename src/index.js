const express = require("express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const getRouter = require("./routes");

const app = express();

const port = 5000;

app.use(express.json());
// Swagger options
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "URL Shortener API",
      version: "1.0.0",
      description: "A simple URL shortener API",
    },
  },
  apis: ["./index.js"], // Point to this file
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const main = async () => {
  const routes = await getRouter();
  app.use("/", routes);

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

main();