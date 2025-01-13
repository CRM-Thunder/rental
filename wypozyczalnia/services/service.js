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
    async getVerifiedReservations() {
        return await repository.getVerifiedReservations();
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
            let rental_data;
            let rental_id;
         try {
            rental_id= await repository.addRental(car_id,customer_id,start_date,end_date);
            console.log(rental_id);

         }
         catch (error) {
             return { success: false, message: error.message};
         }
         try{
             rental_data=await repository.getReservationInfoMaster(rental_id);
         }
         catch (error){
             return {success: true, message:"Reservation added but no information could be parsed at the moment"};
         }
        const rental_response_info={
             start_date:rental_data[0].start_date,
             end_date:rental_data[0].end_date,
             sum_price:rental_data[0].sum_price,
             brand: rental_data[0].brand,
             model: rental_data[0].model,
             production_year:rental_data[0].production_year,
             color: rental_data[0].color,
             car_registration:rental_data[0].car_registration,
             customerName:rental_data[0].customerName,
            customerSurname:rental_data[0].customerSurname,
            customerAge:rental_data[0].customerAge,
            customerAddress:rental_data[0].customerAddress,
            customerPostalCode:rental_data[0].customerPostalCode,
            customerEmail:rental_data[0].customerEmail,
            officeAddress:rental_data[0].officeAddress,
            officePostalCode:rental_data[0].officePostalCode,
            officeCityName:rental_data[0].cityName,
            officeCityState:rental_data[0].cityState
        }




        return {success: true, message:"Rental added successfully", rental_info:rental_response_info};
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
        return {success:false, message:"Failed to authenticate"}


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