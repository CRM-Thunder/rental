const {body}=require("express-validator");

const availableCarsValidator=[
    body('office_id').not().isEmpty().withMessage("id cant be empty").isNumeric().withMessage("id must be a number"),
    body('start_date').not().isEmpty().withMessage("date cant be empty").matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/).withMessage("Wrong date format"),
    body('end_date').not().isEmpty().withMessage("Date cant be empty").matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/).withMessage("Wrong date format"),
];
const addReservationValidator=[
    body('car_id').not().isEmpty().withMessage("id cant be empty").isNumeric().withMessage("id must be a number"),
    body('customer.name').not().isEmpty().withMessage("id cant be empty"),
    body('customer.surname').not().isEmpty().withMessage("id cant be empty"),
    body('customer.age').not().isEmpty().withMessage("id cant be empty").isInt({min:18,max:60}).withMessage("Allowed age is 18-60"),
    body('customer.address')
        .not().isEmpty().withMessage("Address cannot be empty"),
    body('customer.postal_code')
        .not().isEmpty().withMessage("Postal code cannot be empty")
        .matches(/^\d{2}-\d{3}$/).withMessage("Postal code must be in the format XX-XXX"),
    body('customer.city_name')
        .not().isEmpty().withMessage("City name cannot be empty"),
    body('customer.state_name')
        .not().isEmpty().withMessage("State name cannot be empty"),
    body('customer.email')
        .not().isEmpty().withMessage("Email cannot be empty")
        .isEmail().withMessage("Invalid email format"),
    body('start_date').not().isEmpty().withMessage("date cant be empty").matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/).withMessage("Wrong date format"),
    body('end_date').not().isEmpty().withMessage("Date cant be empty").matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/).withMessage("Wrong date format"),




]

module.exports={availableCarsValidator,
    addReservationValidator
}