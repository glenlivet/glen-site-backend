import passport from "passport";
import { Request, Response, NextFunction } from "express";

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate("jwt", function (err, user) {
    if (err) {
      console.log(err);
      return res.status(401).json({ status: "error", code: "unauthorized" });
    }
    if (!user) {
      return res.status(401).json({ status: "error", code: "unauthorized" });
    } else {
      return next();
    }
  })(req, res, next);
};
