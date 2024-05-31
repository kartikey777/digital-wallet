const { checkBalence, addBalence, transferMoney } = require("../../controller/payment/payment");
const userValidationMiddleware = require("../../middleware/userValidation");

const router = require("express").Router();

router.get("/balence" , userValidationMiddleware , checkBalence);
router.post("/add" , userValidationMiddleware , addBalence);
router.post("/transfer" , userValidationMiddleware , transferMoney);

module.exports = router;