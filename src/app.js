import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import cors from "cors";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./app/middleware/globalErrorHandler.js";
import NotFoundHandler from "./error/NotFoundHandler.js";
// import authRouter from "./app/module/auth/auth.route.js";
import allRouter from "./app/routes/routes.js";
import webhookRouter from "./app/module/payment/webhook.routes.js";
import { detectCountry } from "./app/middleware/selectCountryMiddleware.js";
import { redirectUrl } from "./app/middleware/redirect.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

//redirect url middleware
app.use(redirectUrl);

//to get/retrieve upload folder image
// app.use('/uploads', express.static('uploads'));
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// app.use(cors({
//     origin: ["http://10.10.20.60:3005"],
//     credentials: true
// }));
app.use(cors());

//auto detect country while loading
// app.use(detectCountry);
// app.set("trust proxy", true);

//redirect url middleware
app.use(redirectUrl);

//to get/retrieve upload folder image
app.use('/uploads', express.static('uploads'));
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//use webhook route before app.use(express.json())
app.use("/api/v1/webhook", webhookRouter);

// app.use(express.json());
// app.use(express.urlencoded({extended: true}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());


app.get("/",(req,res)=> {
    // console.log(req.country);
    // res.redirect(`/${req.country}`);
    res.send("server is running . welcome .");
});

//all implemented route
app.use("/api/v1", allRouter);
// app.use("/api/v1/auth", authRouter);


//error handler
app.use(globalErrorHandler);
app.use(NotFoundHandler.handle);

export default app;