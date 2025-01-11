const repository = require("../repository/repository.js");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
class Service {
     constructor() {

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
    async getEmployeeData(id){
         return await repository.getEmployeeData(id);
    }

    async addRental(car_id,customer,start_date,end_date) {
         if(await repository.isCarAvailable(car_id, start_date, end_date)===false){
             return {success: false, message:"Car is occupied"};
         }
         const {name, surname, age, address, postal_code, city_name, state_name, email}=customer;
        let city_id=await repository.checkCityExists(city_name.toLowerCase(),state_name.toLowerCase());
        console.log(city_id);
        if(city_id===false){
            try{
                city_id=await repository.addCity(city_name.toLowerCase(),state_name.toLowerCase());
            }
            catch (error){
                return {success: false, message:error.message};
            }
        }
        let customer_id;
        try{
            customer_id=await repository.addCustomer(name, surname, age, address, postal_code, city_id, email);
        }
        catch (error){
           return {success: false, message:error.message, source:"customer"};
        }

         try {
            const rental_id= await repository.addRental(car_id,customer_id,start_date,end_date);
            return {success: true, message:"Rental added successfully", id:rental_id};
         }
         catch (error) {
             return { success: false, message: error.message};
         }
    }

    async login(login, password){
         let user_login_password;
         try{
             user_login_password=await repository.getEmployeeLoginPassword(login);
         }catch (error){
             return {success:false, message:error.message};
         }
         const user_data={login:user_login_password.login, id:user_login_password.id}
         const isMatch=await bcrypt.compare(password,user_login_password.password_hash);
        if(isMatch){
            const token= jwt.sign(user_data, process.env.JWT_SECRET, {expiresIn: '1h'});
            return {success:true, token:token};
        }
        return {success:false, message:"Failed to log in, try again."}


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