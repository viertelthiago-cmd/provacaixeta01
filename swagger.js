// swagger.js
import swaggerJsdoc from "swagger-jsdoc";

const opcoes = {
  definition: {
    openapi: "3.0.0",
    info: { title: "API de Missoes espaciais", version: "1.0.0" },
  },
  apis: ["./app.js"],
};

export default swaggerJsdoc(opcoes);