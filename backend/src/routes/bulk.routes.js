import express from "express";
import { importCSV } from "../controllers/bulk.controller.js";
import {upload}   from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/import", upload.single("file"), importCSV);

export default router;
