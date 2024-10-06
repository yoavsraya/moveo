const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.POSTSignUp = (req, res, next) => {
    const userName = req.body.userName;
    const password = req.body.password;
    const instrument = req.body.instrument;
    const isAdmin = req.body.isAdmin;
    User.findUserByName(userName)
    .then(userDoc => {
        if (userDoc) {
        return res.status(400).json({message: 'User already exists'});
        }
        return bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User(userName, hashedPassword, instrument , isAdmin);
            return user.save()
            .then(savedUser => {
                // Return the saved user back to the client, excluding sensitive information like the password
                res.status(201).json(
                {
                    message: 'User created successfully',
                    user:
                    {
                        _id: savedUser._id,
                        userName: savedUser.userName,
                        instrument: savedUser.instrument,
                        isAdmin: savedUser.isAdmin
                    }
                });
            })
            .catch(err => {console.log(err);});
        })
    })
    .catch(err => {
        console.log(err);
    });
};

exports.POSTLogin = (req, res, next) => {
    const userName = req.body.userName;
    const password = req.body.password;

    User.findUserByName(userName)
        .then(user => {
            if (!user) {
                return res.status(400).json({ message: 'User not found' });
        }

        bcrypt.compare(password, user.password)
          .then(doMatch => {
            if (doMatch) {
              req.session.isLoggedIn = true;
              req.session.user = user;
  
              // Save the session and send a response
              req.session.save(err => {
                if (err) {
                  console.log(err);
                  return res.status(500).json({ message: 'Session save failed' });
                }
  
                const { password, ...safeUser } = user;
                return res.status(200).json({ message: 'Login successful',  user: safeUser });
              });
            } else {
              return res.status(400).json({ message: 'Incorrect password' });
            }
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Error comparing passwords' });
          });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ message: 'Error finding user' });
      });
  };

  exports.GETCheckAdmin = (req, res) =>
    {
        if (req.session.user.isAdmin) {
            res.status(200).json({ isAdmin: true, user: req.session.user });
        } else {
        res.status(200).json({ isAdmin: false });
        }
    };

exports.GETCheckAuth = (req, res) =>
    {
        if (req.session.isLoggedIn) {
            res.status(200).json({ isLoggedIn: true, user: req.session.user });
        } else {
        res.status(200).json({ isLoggedIn: false });
        }
    };

    exports.POSTLogout = (req, res) => 
        {
            console.log('Logging out');
            req.session.destroy(err =>
            {
                if (err)
                {
                    return res.status(500).json({ message: 'Logout failed' });
                }
                res.status(200).json({ message: 'Logout successful' });
            });
        };


