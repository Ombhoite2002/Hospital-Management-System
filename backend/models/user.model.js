const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
      // Password should not be selected in response by default
      get() {
        return undefined; // hide password automatically
      }
    },

    role: {
      type: DataTypes.ENUM(
        'admin',
        'doctor',
        'nurse',
        'receptionist',
        'pharmacist',
        'lab_tech',
        'accountant'
      ),
      allowNull: false,
      defaultValue: 'receptionist',
    },

  }, {
    tableName: 'users',
    timestamps: true,

    hooks: {
      // Hash password before creating user
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },

      // Hash password before updating user
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  });

  // ============================
  //  INSTANCE METHODS
  // ============================

  /**
   * Compare entered password with hashed password
   */
  User.prototype.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.getDataValue('password'));
  };


  /**
   * Generate JWT Auth Token
   */
  User.prototype.generateAuthToken = function () {
    return jwt.sign(
      {
        id: this.id,
        email: this.email,
        role: this.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  };


  /**
   * Remove password from JSON response
   */
  User.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password;
    return values;
  };


  return User;
};
