require("dotenv").config(); // <--- Agregar esta línea

const fs = require("fs");
const path = require("path");
const connectDB = require("../config/db"); // <-- tu conexión actual
const Voltage = require("../models/Voltage");

const saveData = async () => {
  await connectDB();

  // Ruta hacia tu archivo JSON
  const dataPath = path.join(__dirname, "../../data/data.json");


  // Leer el archivo
  const jsonData = JSON.parse(fs.readFileSync(dataPath, "utf8"));

  try {
    const newVoltage = new Voltage({
      voltage: jsonData.voltage,
    });

    await newVoltage.save();
    console.log("✅ Dato de voltaje guardado:", jsonData.voltage, "V");
  } catch (error) {
    console.error("❌ Error al guardar:", error);
  } finally {
    process.exit();
  }
};

saveData();
