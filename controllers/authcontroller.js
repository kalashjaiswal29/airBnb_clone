const { check, validationResult } = require("express-validator");
const User = require("../Models/user");
const bcrypt = require("bcryptjs");

exports.getlogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    currPage: "login",
    editing: false,
    isLoggedIn: false,
    errors: [],
    oldInput: { email: "" },
    user: {},
  });
};

exports.postlogin = async (req, res, next) => {
  console.log(req.body);
  const { email, password } = req.body;
  const user = await User.findOne({ email }); // or email:email
  if (!user) {
    res.status(422).render("auth/login", {
      pageTitle: "LogIn In to airBnb",
      currPage: "login",
      editing: false,
      isLoggedIn: false,
      errors: ["Invalid credentials user not found"],
      oldInput: { email },
      user: {},
    });
  } else {
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("match ", isMatch);
    if (!isMatch) {
      res.status(422).render("auth/login", {
        pageTitle: "LogIn In to airBnb",
        currPage: "login",
        editing: false,
        isLoggedIn: false,
        errors: ["Invalid credentials password"],
        oldInput: { email },
        user: {},
      });
    } else {
      req.session.isLoggedIn = true;
      req.session.user = user;
      // res.cookie("isLoggedIn" , true)
      // req.isLoggedIn = true ;
      await req.session.save();
      res.redirect("/");
    }
  }
};

exports.postlogout = (req, res, next) => {
  // res.cookie("isLoggedIn" ,false)    // or res.clearcookie("isLoggedIn")   ;
  req.session.isLoggedIn = false;
  res.redirect("/");
};

exports.getSignIn = (req, res, next) => {
  res.render("auth/signin", {
    pageTitle: "Sign In to airBnb",
    currPage: "signin",
    editing: false,
    isLoggedIn: false,
    errors: {},
    oldInput: {},
    user: {},
  });
};

exports.postsignin = [
  check("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name required")
    .isLength({ min: 2 })
    .withMessage("First name must contain more than 2 letters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name contains only letters"),

  check("lastName")
    .matches(/^[a-zA-Z\s]*$/) // + means minimum one character *min 0
    .withMessage("Last name contains only letters"),

  check("email")
    .isEmail()
    .withMessage("Enter a valid email")
    .normalizeEmail()
    .notEmpty()
    .withMessage("Email name required"),

  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be of minimum 8 characters")
    .trim()
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase character")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase character")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one digit")
    .matches(/[!@#$%^&*()-_=+?/|{}:;"'><,.]/)
    .withMessage("Password must contain at least one special character"),

  check("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      } else {
        return true;
      }
    }),

  check("userType")
    .notEmpty()
    .withMessage("User type required")
    .isIn(["Guest", "Host"])
    .withMessage("Invalid user type"),

  check("Terms and condition")
    .notEmpty()
    .withMessage("Please accept the terms and condition")
    .custom((value, { req }) => {
      if (value !== "on") {
        throw new Error("Please accept the terms and condition");
      } else {
        return true;
      }
    }),

  (req, res, next) => {
    const { firstName, lastName, email, password, userType } = req.body;
    const errors = validationResult(req);
    console.log("new user registered");
    if (!errors.isEmpty()) {
      return res.status(422).render("auth/signin", {
        pageTitle: "Sign In to airBnb",
        currPage: "signin",
        editing: false,
        isLoggedIn: false,
        errors: errors.array().map((err) => err.msg),
        oldInput: { firstName, lastName, email, password, userType },
        user: {},
      });
    } else {
      bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            userType,
          });
          return user.save();
        })
        .then(() => {
          res.redirect("/login");
        })
        .catch((err) => {
          return res.status(422).render("auth/signin", {
            pageTitle: "Sign In to airBnb",
            currPage: "signin",
            editing: false,
            isLoggedIn: false,
            errors: [err.message],
            oldInput: { firstName, lastName, email, password, userType },
            user: {},
          });
        });
    }
  },
];
