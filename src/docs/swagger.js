import swaggerJSDoc from "swagger-jsdoc";

const opcoes = {
    definition: {
        openapi: "3.0.0",
        info: { title: "API REST gerenciamento de missões espaciais da nasa" }
    },
    apis: ["./app.js"],
};

export default swaggerJSDoc(opcoes);