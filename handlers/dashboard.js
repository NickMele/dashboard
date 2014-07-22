module.exports = function(app) {
  return {
    index: function(req, res, next) {
      return res.render('index')
    }
  }
}
