const express = require("express");
const router = express.Router();
const {master_db, slave_db} = require("./mysql_database_connection.js");
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

router.delete("/Reservation/:id", async (req, res) => {
  const results=await service.deleteRentalById(id);
  res.json(results);
})

// Dodaj nowy samochód
router.post("/", (req, res) => {
  const { brand, model, year, available } = req.body;
  const query = "INSERT INTO cars (brand, model, year, available) VALUES (?, ?, ?, ?)";
  master_db.query(query, [brand, model, year, available], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ message: "Car added successfully", carId: results.insertId });
    }
  });
});

// Aktualizuj dane samochodu
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { brand, model, year, available } = req.body;
  const query = "UPDATE cars SET brand = ?, model = ?, year = ?, available = ? WHERE id = ?";
  master_db.query(query, [brand, model, year, available, id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ message: "Car updated successfully" });
    }
  });
});

// Usuń samochód
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM cars WHERE id = ?";
  master_db.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ message: "Car deleted successfully" });
    }
  });
});

module.exports = router;