module.exports = class Car {
    constructor(id, brand, model, productionYear, color, carRegistration, price, officeAddress, officePostalCode,cityName) {
        this.id = id;
        this.brand = brand;
        this.model = model;
        this.productionYear = productionYear;
        this.color = color;
        this.carRegistration = carRegistration;
        this.price = price;
        this.officeAddress=officeAddress;
        this.officePostalCode=officePostalCode;
        this.cityName=cityName;

    }
};