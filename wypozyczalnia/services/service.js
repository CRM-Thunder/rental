const repository = require("../repository/repository.js");

class Service {
     constructor() {
        this.repository = repository;
    }
    async getCarsWithDetails() {
        return await repository.getCarsWithDetails();
    }
    async getReservationInfo(id){
         try{
            return await repository.getReservationInfo(id);
         }catch (error) {
             return { success: false, message: error.message};
         }
    }
    async getReservations() {
        return await repository.getReservations();
    }
    async getAllOffices() {
        return await repository.getAllOffices();
    }
    async getAllCars() {
        return await repository.getAllCars();
    }
    async getReservationsByCarId(id) {
        return await repository.getReservationsByCarId(id);
    }
    async getUnverifiedReservations() {
        return await repository.getUnverifiedReservations();
    }
    async getAvailableCarsByOfficeAndDates(officeId, startDate, endDate) {
        return await repository.getAvailableCarsByOfficeAndDates(officeId, startDate, endDate);
    }

    async addRental(car_id,customer_id,start_date,end_date) {
         try {
            return await repository.addRental(car_id,customer_id,start_date,end_date);
         }
         catch (error) {
             return { success: false, message: error.message};
         }
    }

    async deleteRentalById(id) {
         try {
             return await repository.deleteRentalById(id);
         }catch (error) {
             return { success: false, message: error.message};
         }
    }
    async verifyRental(id){
        try {
            return await repository.verifyRental(id);
        }catch(error){
            return { success: false, message: error.message};
        }
    }

}
module.exports=new Service();