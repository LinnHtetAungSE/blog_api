const bcrypt = require("bcrypt");
const saltRounds = parseInt(process.env.SALT);
const getBcryptPassword = async (password) => {
  const bcryptPassword = await bcrypt
    .hash(password, saltRounds)
    .then((hash) => {
      return hash;
    })
    .catch((err) => console.error(err.message));
  return bcryptPassword;
};

async function validatePassword(password, storedHash) {
  try {
    const match = await bcrypt.compare(password, storedHash);
    return match;
  } catch (error) {
    console.error("Error comparing password:", error.message);
    throw new Error("Failed to validate password");
  }
}

module.exports = {
  getBcryptPassword,
  validatePassword,
};
