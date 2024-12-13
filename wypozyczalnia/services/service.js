const repository = require("../repository/repository.js");

class Service {
     constructor() {
        this.repository = repository;
    }
    async getCarsWithDetails() {
        return await repository.getCarsWithDetails();
    }
    async getReservationInfo(id){
        return await repository.getReservationInfo(id);
    }
    async getReservations() {
        return await repository.getReservations();
    }
    async deleteRentalById(id) {
        return await repository.deleteRentalById(id);
    }
}
module.exports=new Service();