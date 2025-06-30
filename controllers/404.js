exports.error = (req, res, next) => {
  //error code must be set as the user doesnt know but as a proffesional developer
  res.status(404).render("error", {
    pageTitle: "Error : 404",
    currPage: "404",
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
};
