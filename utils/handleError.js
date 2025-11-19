const handleError = (err) => {
    let errors = { firstname: "", lastname: "", email: "", password: "", role: ""};

    if(err.code === 11000){
        errors.email = "Email is already in use";
        return errors;
    }
    if(err.message === 'user not found') {
        errors.email = 'This email has not been registered';
        return errors;
    }
    if(err.message === 'Incorrect password') {
        errors.email = 'Invalid credentials';
        errors.password = 'Invalid credentials';
        return errors;
    }

    if(err.name === 'ValidationError') {
        Object.values(err.errors).forEach((error) => {
            if(error.properties && error.properties.path) {
                errors[error.properties.path] = error.properties.message
            }
            
        });
        return errors;
    }
    return errors;
};

module.exports = handleError;