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
            Rental.id AS rental_id,
            Rental.start_date,
            Rental.end_date,
            Rental.is_reservation_active,
            Rental.sum_price,
            Car.id AS car_id,
            Car.brand,
            Car.model,
            Car.production_year,
            Car.color,
            Car.car_registration,
            Car.price AS car_price,
            Customer.id AS customer_id,
            Customer.name AS customer_name,
            Customer.surname AS customer_surname,
            Customer.age AS customer_age,
            Customer.address AS customer_address,
            Customer.postal_code AS customer_postal_code,
            Customer.email AS customer_email,
            Office.id AS office_id,
            Office.address AS office_address,
            Office.postal_code AS office_postal_code,
            City.name AS city_name,
            City.state AS city_state
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
        return rows;

    }

    async getReservations() {
        if (!this.slave_db) {
            throw new Error("Database connection is not initialized");
        }

        const [rows] = await this.slave_db.query(`
            SELECT
                Rental.id AS "Identyfikator rezerwacji",
                Car.car_registration AS Rejestracja,
                Car.brand AS Marka,
                Car.model AS Model,
                Rental.start_date AS Data_Wypożyczenia,
                Rental.end_date AS Data_Zwrotu
            FROM
                Rental
            INNER JOIN
                Car ON Rental.car_id = Car.id;
        `);
        return rows;
    }

    async deleteRentalById(id) {
        if (!this.master_db) {
            throw new Error("Database connection is not initialized");
        }

        try {

            const [result] = await this.master_db.query(
                "DELETE FROM Rental WHERE id = ?",
                [id]
            );

            if (result.affectedRows === 0) {
                throw new Error(`Rental with ID ${id} does not exist`);
            }
            return { success: true, message: `Rental with ID ${id} deleted successfully.` };
        } catch (error) {
            return { success: false, message: error.message };

        }
    }
}

module.exports = new Repository();