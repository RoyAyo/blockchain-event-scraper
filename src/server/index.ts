import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from 'express-rate-limit';

import '../config/database';
import Event from "../common/modules/events/events.model";

dotenv.config();
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, 
	max: 100,
	standardHeaders: true,
	legacyHeaders: false,
})

// Boot express
const app: Application = express();
const port = process.env.PORT || 3000;

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(limiter)

// Application routing
app.get("/", (req: Request, res: Response) => {
  res.status(200).send({ data: "HI TEST APPLICATION" });
});

app.get("/events", async (req: Request, res: Response) => {
	try {
		const integrator = req.query.integrator;
		const filter = integrator ? {
			integrator
		} : {};
		const events = await Event.find(filter).sort({blockNo: -1});
		return res.json({
			data: events
		});
	} catch (error) {
		return res.json({
			error: error,
			success: false
		})
	}
});

// Start server
app.listen(port, () => console.log(`Server is listening on port ${port}!`));

// Handle unhandled promise rejections and exceptions
process.on("unhandledRejection", (err: Error) => {
  console.log(err);
});

process.on("uncaughtException", (err: Error) => {
  console.log(err.message);
});