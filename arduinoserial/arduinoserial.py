import serial
import time
import os
from pymongo import MongoClient
from dotenv import load_dotenv

# === Cargar variables del archivo .env ===
load_dotenv()

# === Configuración MongoDB ===
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB = os.getenv("MONGO_DB", "titanic")

client = MongoClient(MONGO_URI)
db = client[MONGO_DB]
collection = db["voltages"]

print(f"Conectado a MongoDB: {MONGO_URI}, base de datos: {MONGO_DB}")

# === Configuración Serial ===
arduino = serial.Serial(port='COM6', baudrate=9600, timeout=2)
time.sleep(2)  # Espera que el puerto se estabilice

print("Leyendo datos del PZEM004T...\n")

try:
    while True:
        line = arduino.readline().decode('utf-8').strip()
        
        time.sleep(5) # Le damos tiempo al arduino de inicializarse
        if line:
            try:
                voltage, current, power = map(float, line.split(','))
                print(f"Voltaje: {voltage:.2f} V | Corriente: {current:.3f} A | Potencia: {power:.2f} W\n")
                
                if voltage > 0:
                    # === Insertar en MongoDB ===
                    doc = {
                        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
                        "voltage": voltage,
                        "current": current,
                        "power": power
                    }
                    collection.insert_one(doc)
                    print("Datos insertados en a tabla") 
                 
            except ValueError:
                print("Dato no válido recibido:", line)
        

except KeyboardInterrupt:
    print("\nLectura finalizada.")
    arduino.close()
    client.close()
