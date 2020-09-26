import express from "express";
import compression from "compression"; // compresses requests
import session from "express-session";
import bodyParser from "body-parser";
import lusca from "lusca";
import flash from "express-flash";
import path from "path";
import passport from "passport";
import { SESSION_SECRET } from "./util/secrets";

import * as userController from "./controllers/user";
import * as authController from "./controllers/auth";
import * as fileController from "./controllers/file";


// Create Express server
const app = express();

const apiRouter = express.Router();

// Express configuration
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use(
  express.static(path.join(__dirname, "public"))
);

/**
 * Primary app routes.
 */
apiRouter.post("/login", userController.postLogin);
apiRouter.get("/logout", authController.authenticateJWT, userController.logout);
apiRouter.get("/fileList", authController.authenticateJWT, fileController.getFileList);
apiRouter.get("/file/:name", authController.authenticateJWT, fileController.downloadFile);

app.use("/api", apiRouter);

export default app;
