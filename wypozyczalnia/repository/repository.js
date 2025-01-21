const { connectDatabases, getMasterDb, getSlaveDb } = require("../mysql_database_connection");

class Repository {
    constructor() {
        this.master_db = null;
        this.slave_db=null;
    }

    async init() {
        await connectDatabases();
        this.master_db = getMasterDb();
        this.slave_db=getSlaveDb();
    }

    async getEmployeeLoginPassword(username){
        if (!this.slave_db) {
            throw new Error("Database connection is not initialized");
        }

        const [rows] = await this.slave_db.query(
            `SELECT id, login, password_hash
             FROM Employee
             WHERE login=? LIMIT 1;`
        ,[username]);
        if(rows.length===0){
            throw new Error("Failed to authenticate");
        }
        return rows[0];
    }
    //funkcja do wytestowania sql injection
    async getEmployeeLoginPasswordUnsafe(username){
        if (!this.master_db) {
            throw new Error("Database connection is not initialized");
        }
        console.log("wchodzi");
        console.log("SELECT id, login, password_hash\n" +
            "             FROM Employee\n" +
            "             WHERE login='' OR 1=1; INSERT INTO City (state, name) VALUES ('nygusowo', 'wioskabambiego');--'");
        const [rows] = await this.master_db.query(
            `SELECT id, login, password_hash
             FROM Employee
             WHERE login='${username}'`);
        if(rows.length===0){
            throw new Error("Failed to authenticate");
        }
        return rows[0];
    }
    async getEmployeeData(id){
        if (!this.slave_db) {
            throw new Error("Database connection is not initialized");
        }

        const [rows] = await this.slave_db.query(
            `SELECT id, login, name, surname, email
             FROM Employee
             WHERE id=? LIMIT 1;`
            ,[id]);
        if(rows.length===0){
            throw new Error("Failed to authenticate");
        }
        return rows[0];
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
            Rental.is_verified,
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
    async getReservationInfoMaster(id){
        if (!this.master_db) {
            throw new Error("Database connection is not initialized");
        }
        const [rows]=await this.master_db.query(`SELECT 
            Rental.id AS rentalId,
            Rental.start_date,
            Rental.end_date,
            Rental.is_verified,
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
    async checkCityExists(cityName, stateName) {
        if (!this.slave_db) {
            throw new Error("Database connection is not initialized");
        }

        const [rows] = await this.slave_db.query(`
        SELECT
            id
        FROM
            City
        WHERE
            LOWER(name) = ? AND LOWER(state) = ?;
    `, [cityName, stateName]);
        if (rows.length>0){
            return rows[0].id;
        }
        else{
            return false;
        }
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
    async getVerifiedReservations() {
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
            Rental.is_verified = 1;
    `);

        return rows;
    }


    async getAvailableCarsByOfficeAndDates(officeId, startDate, endDate) {
        if (!this.slave_db) {
            throw new Error("Database connection is not initialized");
        }

        const [rows] = await this.slave_db.query(`
            SELECT c.id, c.brand, c.model,  c.production_year AS productionYear, c.color, c.price
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

    async isCarAvailable(carId, startDate, endDate) {
        if (!this.slave_db) {
            throw new Error("Database connection is not initialized");
        }

        const [rows] = await this.slave_db.query(`
        SELECT 1
        FROM Rental r
        WHERE r.car_id = ?
          AND (
            (r.start_date < ? AND r.end_date > ?)
          )
    `, [carId, endDate, startDate]);

        return rows.length === 0;
    }



    async addCity(cityName, stateName) {
        if (!this.master_db) {
            throw new Error("Database connection is not initialized");
        }

        // Wstawienie nowego miasta
        const [result] = await this.master_db.query(`
        INSERT INTO City (name, state)
        VALUES (?, ?);
    `, [cityName, stateName]);
        if(result.affectedRows===0){
            throw new Error("Error while adding city")
        }
        return result.insertId // Zwraca ID nowo dodanego miasta
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
        return result.insertId;

    }

    async addCustomer(name, surname, age, address, postalCode, cityId, email) {
        if (!this.master_db) {
            throw new Error("Database connection is not initialized");
        }
        // Wstawienie nowego klienta
        const [result] = await this.master_db.query(`
        INSERT INTO Customer (name, surname, age, address, postal_code, city_id, email)
        VALUES (?, ?, ?, ?, ?, ?, ?);
    `, [name, surname, age, address, postalCode, cityId, email]);
        if(result.affectedRows===0) {
            throw new Error("Error while adding customer data")
        }
            return result.insertId;

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