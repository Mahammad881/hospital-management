const bcrypt = require("bcryptjs");

async function generate() {
  const adminPass = await bcrypt.hash("admin123", 10);
  const doctorPass = await bcrypt.hash("doctor123", 10);
  const receptionPass = await bcrypt.hash("reception123", 10);

  console.log("Admin Hash:", adminPass);
  console.log("Doctor Hash:", doctorPass);
  console.log("Reception Hash:", receptionPass);
}

generate();