import express from "express";

//rotas
import { customerRouter } from "../customerRouter.js";
import { personalAccessTokenRouter } from "../personalAcessTokenRouter.js";
import { accidentRouter } from "../accidentRouter.js";
import { constructionRouter } from "../constructionRouter.js";
import { employeeRouter } from "../employeeRouter.js";


const version1Router = express.Router();

version1Router.use(`/customer`, customerRouter);
version1Router.use(`/token`, personalAccessTokenRouter);
version1Router.use(`/accident`, accidentRouter);
version1Router.use(`/construction`, constructionRouter);
version1Router.use(`/employee`, employeeRouter);

export {version1Router};