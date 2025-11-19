const propertyError = (err) => {
    let errors = { title: "", location: "", price: "" , numberOfBathrooms: "", numberOfBedrooms: "", image: ""};

    if(err.code === 11000) {
        errors.message = "Duplicate field detected";
        return errors;
    }
    
    if(err.message === "property not found") {
        errors.message = "Property not found";
        return errors;
    }

    if(err.name === "ValidationError") {
        Object.values(err.errors).forEach((error) => {
            if (error.properties && error.properties.path) {
                errors[error.properties.path] = error.properties.message;
            }
        });
        return errors;
    }

    return errors;
};



module.exports = propertyError;