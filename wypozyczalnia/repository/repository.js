const { connectDatabases, getMasterDb } = require("../mysql_database_connection");

class Repository {
    constructor() {
        this.master_db = null;
    }

    async init() {
        await connectDatabases(); // Poczekaj, aż połączenie zostanie nawiązane
        this.master_db = getMasterDb();
    }

    async getCarsWithDetails() {
        if (!this.master_db) {
            throw new Error("Database connection is not initialized");
        }

        const [rows] = await this.master_db.query(
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
}

module.exports = new Repository();