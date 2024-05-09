const express = require("express")
const router = express.Router()
const formController = require("../controllers/form.contoller")


router.post("/form", formController.sendUserData)

module.exports = router