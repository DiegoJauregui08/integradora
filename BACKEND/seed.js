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

    // Crear hash de la contraseña de capitan
    const hashedPassword = await bcrypt.hash("capitan08", 10);

    // Insertar usuario capitan si no existe
    const existingUser = await User.findOne({ username: "capitan" });
    if (!existingUser) {
      const user = new User({
        username: "capitan",
        password: hashedPassword,
        role: "user", // puedes cambiar el rol si quieres
      });
      await user.save();
      console.log("✅ Usuario creado con éxito:");
      console.log("   Usuario: capitan");
      console.log("   Contraseña: capitan08");
    } else {
      console.log("⚠️ El usuario 'capitan' ya existe, no se creó de nuevo.");
    }

    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error al ejecutar seed:", err);
  }
}

seed();
