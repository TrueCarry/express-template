import passport from 'passport'
import {Strategy as LocalStrategy} from 'passport-local'

import { User } from '../models'

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user)
  })
})

passport.use(new LocalStrategy(
  (username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) { return done(err) }
      if (!user) { return done(null, false) }

      user.comparePassword(password, (err, match) => {
        if (err) { return done(err) }
        if (!match) { return done(null, false) }
        return done(null, user)
      })
    })
  }
))