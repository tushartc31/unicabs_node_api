const { checkToken } = require("../../auth/token_validation");
const { addBookingValidation } = require("../../validations/booking/booking.validation");
const { createBooking, getBookingList, getBookingByBookingId, updateBooking, deleteBooking, getBookingsByDateRange, getBookingTotalCommissionByMonthYear,getBookingTotalBookingPriceByMonthYear, getBookingTotalBookingCountByMonthYear,getBookingsByDateRangeTemp} = require("../controllers/booking.controller");
const router = require('express').Router();

router.post("/create", checkToken, addBookingValidation, createBooking);
router.get("/getByDateRange", checkToken, getBookingsByDateRange);
router.get("/getBookingTotalCommissionByMonthYear", checkToken, getBookingTotalCommissionByMonthYear);
router.get("/getBookingTotalBookingPriceByMonthYear", checkToken, getBookingTotalBookingPriceByMonthYear);
router.get("/getBookingTotalBookingCountByMonthYear", checkToken, getBookingTotalBookingCountByMonthYear);
router.get("/bookingList", checkToken, getBookingList);
router.get("/:id", getBookingByBookingId);
router.patch("/update/:id", checkToken, addBookingValidation, updateBooking);
router.delete("/delete/:id", checkToken, deleteBooking);

module.exports = router;