const express = require("express");
const router = express.Router();
const service=require("./services/service.js");

// Pobierz listę wszystkich samochodów
router.get("/CarsWithDetails", async (req, res) => {
      const results= await service.getCarsWithDetails();
      res.json(results);


});
router.get("/ReservationInfo", async (req, res) => {
      const results= await service.getReservationInfo(req.query.id);
      res.json(results);
})

router.get("/Reservations", async (req, res) => {
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

router.get("/CarReservation", async (req, res) => {
  const results=await service.getReservationsByCarId(req.query.id);
  res.json(results);
})

router.get("/UnverifiedReservations", async (req, res) => {
  const results=await service.getUnverifiedReservations();
  res.json(results);
})

router.get("/AvailableCars",async (req, res) => {
  const {office_id, start_date, end_date}=req.body;
  const results=await service.getAvailableCarsByOfficeAndDates(office_id, start_date, end_date);
  res.json(results);
})

router.post("/Reservation", async (req, res) => {
  const {car_id, customer_id, start_date, end_date}=req.body;
  const results=await service.addRental(car_id, customer_id, start_date, end_date);
  res.json(results);
})

router.delete("/Reservation", async (req, res) => {
  const results=await service.deleteRentalById(req.query.id);
  res.json(results);
})
router.put("/Verify", async (req, res) => {
  const results=await service.verifyRental(req.query.id);
  res.json(results);
})

module.exports = router;