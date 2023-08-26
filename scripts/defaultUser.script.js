const bcrypt = require('bcrypt');
const User = require('../models/user.model');

const constants = require('../config/constants');
const dateFormat = require('../helpers/dateFormat.helper');

const addDefaultAdmin = async () => {
    let isAdminExists = await User.findOne({ user_type: constants.USER_TYPE.ADMIN }).lean();

    if (isAdminExists) {
        console.log('Admin already exists...!!!');
    } else {
        // let password = Math.random().toString(36).slice(-8);
        let password = "pwd@!123";
        let currentDateTime = dateFormat.setCurrentTimestamp();

        let userData = {
            mobile_number: '9909313669',
            first_name: 'Admin',
            last_name: 'Super',
            user_type: constants.USER_TYPE.ADMIN,
            created_at: currentDateTime,
            updated_at: currentDateTime
        }

        await new User(userData).save();

        console.log('Admin created successfully...!');
        console.log('Admin data:', { email: userData.email, password: password });
    }
};




module.exports = { addDefaultAdmin };