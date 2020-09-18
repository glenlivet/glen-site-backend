import passport from "passport";
import passportLocal from "passport-local";
import passportJwt from "passport-jwt";
import * as jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { SESSION_SECRET } from "../util/secrets";
import _ from "lodash";

const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

passport.serializeUser<any, any>((user, done) => {
    done(undefined, user.username);
});

passport.deserializeUser((id, done) => {
  done(null, {username: id, password: process.env.PASSWORD});
});


/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy(async (username, password, done) => {
  const passEqual = await bcrypt.compare(password, process.env.PASSWORD);
  if (username === process.env.USERNAME
    && passEqual) {
      //generate jwt
      const token = jwt.sign({ username: username }, SESSION_SECRET);
      done(undefined, {username: username, token: token})
    }
}));

passport.use(new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: SESSION_SECRET
  }, function (jwtToken, done) {
    if (jwtToken.username === process.env.USERNAME) {
      return done(undefined, {username: jwtToken.username}, jwtToken);
    } else {
      return done(undefined, false);
    }
  }));
