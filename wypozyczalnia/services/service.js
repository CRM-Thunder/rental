const repository = require("../repository/repository.js");

class Service {
     constructor() {
        this.repository = repository;
    }
    async init_repository(){
         await repository.init();
    }
    async getCarsWithDetails() {
        return await repository.getCarsWithDetails();
    }
}
module.exports=new Service();