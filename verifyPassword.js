const bcrypt = require('bcryptjs');

const hashedPassword = '$2a$10$eVvkB0nCo7qOvvlpVSElaeumELbXAcc8rT8Z4WGvQ4q6abfjA.7C.'; // Replace with the actual hashed password from the database
const plainPassword = 'Dangote419'; // Replace with the actual plain password you want to verify

bcrypt.compare(plainPassword, hashedPassword, (err, isMatch) => {
    if (err) {
        console.error('Error comparing passwords:', err);
    } else if (isMatch) {
        console.log('Passwords match');
    } else {
        console.log('Passwords do not match');
    }
});
