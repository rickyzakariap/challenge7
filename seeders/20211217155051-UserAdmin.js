'use strict';
const bcrypt = require('bcrypt');
function encrypt(password) {
  return bcrypt.hashSync(password, 10);
}
module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    //  Add seed commands here.
     
    await queryInterface.bulkInsert('Users', [{
      username: 'BinarAdmin',
      password: encrypt("binarch7"),
      email: "binar@mail.com",
      createdAt: new Date(),
      updatedAt: new Date(),
      role: "SuperAdmin"
     }]);
    
  },

  down: async (queryInterface, Sequelize) => {
    
     await queryInterface.bulkDelete('Users', null, {});
     
  }
};
