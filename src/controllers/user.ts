import passport from "passport";
import { Request, Response, NextFunction } from "express";
import { IVerifyOptions } from "passport-local";
import { check, sanitize, validationResult } from "express-validator";

import "../config/passport";

/**
 * Sign in using email and password.
 * @route POST /login
 */
export const postLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await check("username", "Email is not valid").isEmail().run(req);
  await check("password", "Password cannot be blank")
    .isLength({ min: 1, max: 16 })
    .run(req);
  // eslint-disable-next-line @typescript-eslint/camelcase
  await sanitize("username")
    .normalizeEmail({ gmail_remove_dots: false })
    .run(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.flash("errors", errors.array());
    return res.status(401).end();
  }

  passport.authenticate(
    "local",
    (err: Error, user: any, info: IVerifyOptions) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        req.flash("errors", { msg: info.message });
        return res.status(401).end();
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", { msg: "Success! You are logged in." });
        res.json(user);
      });
    }
  )(req, res, next);
};

/**
 * Log out.
 * @route GET /logout
 */
export const logout = (req: Request, res: Response) => {
  req.logout();
  res.end();
};
