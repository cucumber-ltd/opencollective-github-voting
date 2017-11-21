const express = require('express')

const wrapHandler = asyncFn => (req, res, next) => {
  asyncFn(req, res, next).catch(err => next(err))
}

const asyncRouter = router => {
  router = router || express.Router()
  router.$delete = (path, asyncFn) => router.delete(path, wrapHandler(asyncFn))
  router.$get = (path, asyncFn) => router.get(path, wrapHandler(asyncFn))
  router.$post = (path, asyncFn) => router.post(path, wrapHandler(asyncFn))
  router.$put = (path, asyncFn) => router.put(path, wrapHandler(asyncFn))
  return router
}

module.exports = asyncRouter