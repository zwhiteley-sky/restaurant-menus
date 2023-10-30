const { sequelize } = require('../db');
const { Sequelize, DataTypes } = require('sequelize');

const Menu = sequelize.define("Menu", {
    title: DataTypes.STRING
});

module.exports = {Menu};
