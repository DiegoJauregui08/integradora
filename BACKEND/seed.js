require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Borrar usuarios previos (opcional, para evitar duplicados)
    await User.deleteMany({});

    // Crear hash de la contraseña
    const hashedPassword = await bcrypt.hash("123456", 10);

    // Insertar usuario admin
    const user = new User({
      username: "diego",
      password: hashedPassword,
      role: "admin",
    });

    await user.save();
    console.log("✅ Usuario creado con éxito:");
    console.log("   Usuario: diego");
    console.log("   Contraseña: 123456");

    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error al ejecutar seed:", err);
  }
}

seed();
