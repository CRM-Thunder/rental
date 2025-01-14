const express = require("express");
const router = express.Router();
const service=require("./services/service.js");
const authenticateToken=require("./middleware/middleware");
const {availableCarsValidator,addReservationValidator} = require("./middleware/validator");
const {validationResult} = require("express-validator");

router.get("/CarsWithDetails", async (req, res) => {
      const results= await service.getCarsWithDetails();
      res.json(results);


});
router.get("/ReservationInfo",authenticateToken, async (req, res) => {
      const results= await service.getReservationInfo(req.query.id);
      res.json(results);
})

router.get("/Reservations",authenticateToken, async (req, res) => {
  try {
    const results = await service.getReservations();
    res.json(results);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

router.get("/Offices", async (req, res) => {
  const results = await service.getAllOffices();
  res.json(results);
})

router.get("/Cars", async (req, res) => {
  const results = await service.getAllCars();
  res.json(results);
})

router.get("/CarReservation",authenticateToken, async (req, res) => {
  const results=await service.getReservationsByCarId(req.query.id);
  res.json(results);
})

router.get("/UnverifiedReservations",authenticateToken, async (req, res) => {
  const results=await service.getUnverifiedReservations();
  res.json(results);
})

router.get("/VerifiedReservations",authenticateToken, async (req, res) => {
  const results=await service.getVerifiedReservations();
  res.json(results);
})

router.post("/AvailableCars",availableCarsValidator,async (req, res) => {
  const errors=validationResult(req);
  if(!errors.isEmpty()){
    res.status(422).json({errors:errors.array()})
  }else{
    const {office_id, start_date, end_date}=req.body;
    const results=await service.getAvailableCarsByOfficeAndDates(office_id, start_date, end_date);
    res.json(results);
  }

})

router.get("/EmployeeInfo",authenticateToken,async (req,res)=>{
  const results=await service.getEmployeeData(req.user.id);
  res.json(results);
})

router.post("/Reservation",addReservationValidator, async (req, res) => {
  const errors=validationResult(req);
  if(!errors.isEmpty()){
    res.status(422).json({errors:errors.array()});
  }
  else{ const {car_id, customer, start_date, end_date}=req.body;
    const results=await service.addRental(car_id, customer, start_date, end_date);
    res.json(results);}

})

router.post("/Login", async (req, res)=>{
  const {login, password}=req.body;
  const results=await service.login(login,password);
  res.json(results);
})

router.delete("/Reservation",authenticateToken, async (req, res) => {
  const results=await service.deleteRentalById(req.query.id);
  res.json(results);
})
router.put("/Verify",authenticateToken, async (req, res) => {
  const results=await service.verifyRental(req.query.id);
  res.json(results);
})

module.exports = router;