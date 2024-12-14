const { connectDatabases, getMasterDb, getSlaveDb } = require("../mysql_database_connection");

class Repository {
    constructor() {
        this.master_db = null;
        this.slave_db=null;
    }

    async init() {
        await connectDatabases(); // Poczekaj, aż połączenie zostanie nawiązane
        this.master_db = getMasterDb();
        this.slave_db=getSlaveDb();
    }

    async getCarsWithDetails() {
        if (!this.slave_db) {
            throw new Error("Database connection is not initialized");
        }

        const [rows] = await this.slave_db.query(
            `SELECT 
        Car.id, 
        Car.brand, 
        Car.model, 
        Car.production_year AS productionYear, 
        Car.color, 
        Car.car_registration AS carRegistration, 
        Car.price, 
        Office.address AS officeAddress, 
        Office.postal_code AS officePostalCode, 
        City.name AS cityName
      FROM 
        Car
      INNER JOIN 
        Office ON Car.office_id = Office.id
      INNER JOIN 
        City ON Office.city_id = City.id;`
        );
        return rows;

    }

    async getReservationInfo(id){
        if (!this.slave_db) {
            throw new Error("Database connection is not initialized");
        }
        const [rows]=await this.slave_db.query(`SELECT 
            Rental.id AS rentalId,
            Rental.start_date,
            Rental.end_date,
            Rental.is_reservation_active,
            Rental.sum_price,
            Car.id AS carId,
            Car.brand,
            Car.model,
            Car.production_year,
            Car.color,
            Car.car_registration,
            Car.price AS carPrice,
            Customer.id AS customerId,
            Customer.name AS customerName,
            Customer.surname AS customerSurname,
            Customer.age AS customerAge,
            Customer.address AS customerAddress,
            Customer.postal_code AS customerPostalCode,
            Customer.email AS customerEmail,
            Office.id AS officeId,
            Office.address AS officeAddress,
            Office.postal_code AS officePostalCode,
            City.name AS cityName,
            City.state AS cityState
        FROM 
            Rental
        INNER JOIN 
            Car ON Rental.car_id = Car.id
        INNER JOIN 
            Customer ON Rental.customer_id = Customer.id
        INNER JOIN 
            Office ON Car.office_id = Office.id
        INNER JOIN 
            City ON Office.city_id = City.id
        WHERE 
            Rental.id = ?;
        `,[id]);
        if(rows.length===0){
            throw new Error(`Rental with ID ${id} does not exist`);
        }
        return rows;

    }

    async getReservations() {
        if (!this.slave_db) {
            throw new Error("Database connection is not initialized");
        }

        const [rows] = await this.slave_db.query(`
            SELECT
                Rental.id AS rentalId,
                Car.car_registration AS carRegistration,
                Car.brand,
                Car.model,
                Rental.start_date AS leaseStartDate,
                Rental.end_date AS leaseEndDate
            FROM
                Rental
            INNER JOIN
                Car ON Rental.car_id = Car.id;
        `);
        return rows;
    }
    async getAllOffices() {
        if (!this.slave_db) {
            throw new Error("Database connection is not initialized");
        }

        const [rows] = await this.slave_db.query(`
            SELECT
                Office.id,
                Office.address,
                Office.postal_code AS postalCode,
                City.name AS cityName,
                City.state AS cityState
            FROM
                Office
            INNER JOIN
                City ON Office.city_id = City.id;
        `);
        return rows;
    }

    async getAllCars() {
        if (!this.slave_db) {
            throw new Error("Database connection is not initialized");
        }

        const [rows] = await this.slave_db.query(`
            SELECT
                Car.id,
                Car.brand,
                Car.model,
                Car.production_year AS productionYear,
                Car.color,
                Car.car_registration AS carRegistration,
                Car.price
            FROM
                Car;
        `);
        return rows;
    }

    async getReservationsByCarId(carId) {
        if (!this.slave_db) {
            throw new Error("Database connection is not initialized");
        }

        const [rows] = await this.slave_db.query(`
            SELECT
                Rental.id AS rentalId,
                Rental.start_date AS leaseStartDate,
                Rental.end_date AS leaseEndDate,
                Rental.is_reservation_active AS isReservationActive,
                Rental.sum_price AS sumPrice,
                Customer.name AS customerName,
                Customer.surname AS customerSurname,
                Car.brand,
                Car.model
            FROM
                Rental
            INNER JOIN
                Car ON Rental.car_id = Car.id
            INNER JOIN
                Customer ON Rental.customer_id = Customer.id
            WHERE
                Car.id = ?;
        `, [carId]);

        return rows;
    }

    async getUnverifiedReservations() {
        if (!this.slave_db) {
            throw new Error("Database connection is not initialized");
        }

        const [rows] = await this.slave_db.query(`
        SELECT
            Rental.id AS rentalId,
            Rental.start_date AS leaseStartDate,
            Rental.end_date AS leaseEndDate,
            Rental.sum_price AS sumPrice,
            Customer.name AS customerName,
            Customer.surname AS customerSurname,
            Car.brand,
            Car.model
        FROM
            Rental
        INNER JOIN
            Car ON Rental.car_id = Car.id
        INNER JOIN
            Customer ON Rental.customer_id = Customer.id
        WHERE
            Rental.is_verified = 0;
    `);

        return rows;
    }


    async getAvailableCarsByOfficeAndDates(officeId, startDate, endDate) {
        if (!this.slave_db) {
            throw new Error("Database connection is not initialized");
        }

        const [rows] = await this.slave_db.query(`
            SELECT c.brand, c.model,  c.production_year AS productionYear, c.color, c.price
            FROM Car c
            WHERE c.office_id = ?
              AND NOT EXISTS (
                SELECT 1
                FROM Rental r
                WHERE r.car_id = c.id
                  AND (
                    (r.start_date < ? AND r.end_date > ?)
                  )
            );
        `, [officeId, endDate, startDate]);

        return rows;
    }



    async addRental(car_id,customer_id,start_date,end_date) {
        if(!this.master_db){
            throw new Error("Database connection is not initialized");
        }
        const [result] =await this.master_db.query(`
            INSERT INTO Rental (car_id, customer_id, start_date, end_date, is_verified, sum_price)
            VALUES (?, ?, ?, ?, 0,(SELECT (TIMESTAMPDIFF(HOUR, ?, ?))*Car.price FROM Car WHERE Car.id = ?));
        `,[car_id,customer_id,start_date,end_date, start_date, end_date, car_id]);
        if(result.affectedRows===0){
            throw new Error("Error while adding rental");
        }
        return { success: true, message: "Rental added successfully." };

    }


    async deleteRentalById(id) {
        if (!this.master_db) {
            throw new Error("Database connection is not initialized");
        }
            const [result] = await this.master_db.query(
                "DELETE FROM Rental WHERE id = ?",
                [id]
            );

            if (result.affectedRows === 0) {
                throw new Error(`Rental with ID ${id} does not exist`);
            }
            return { success: true, message: `Rental with ID ${id} deleted successfully.` };
    }
    async verifyRental(id){
        if(!this.master_db){
            throw new Error("Database connection is not initialized");
        }
        const [result] = await this.master_db.query(
            "UPDATE Rental SET is_verified = 1 WHERE id = ?",
            [id]
        );
        if(result.affectedRows===0){
            throw new Error(`Rental with ID ${id} does not exist`);
        }
        return { success: true, message: `Rental with ID ${id} verified successfully.` };
    }


}

module.exports = new Repository();