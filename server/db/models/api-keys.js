const Sequelize = require("sequelize");
const db = require("../db");
const crypto = require("crypto");

const Apikey = db.define("Apikey", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  key: {
    type: Sequelize.TEXT,
    // act like a private method
    get() {
      return () => this.getDataValue("key");
    },
  },
  salt: {
    type: Sequelize.STRING,
    get() {
      return () => this.getDataValue("salt");
    },
  },
});

Apikey.prototype.correctKey = function (candidateKey) {
  return Apikey.encryptKey(candidateKey, this.salt()) === this.password();
};

Apikey.generateSalt = function () {
  return crypto.randomBytes(16).toString("base64");
};

Apikey.encryptKey = function (text, salt) {
  return crypto
    .createHash("RSA-SHA256")
    .update(text)
    .update(salt)
    .digest("Hex");
};

const setSaltAndPassword = (key) => {
  if (key.changed("key")) {
    key.salt = Apikey.generateSalt();
    key.key = Apikey.encryptKey(key.key(), key.salt());
  }
};

Apikey.beforeCreate(setSaltAndPassword);
Apikey.beforeUpdate(setSaltAndPassword);
Apikey.beforeBulkCreate((keys) => {
  keys.forEach(setSaltAndPassword);
});
module.exports = Apikey;
