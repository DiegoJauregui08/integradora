import serial
import time

# Configura el puerto serie (ajusta el COM según el que use tu Arduino)
# En Windows suele ser COM3, COM4, etc.
# En Linux/Mac sería /dev/ttyUSB0 o /dev/ttyACM0
arduino = serial.Serial(port='COM3', baudrate=9600, timeout=2)

time.sleep(2)  # Espera 2 segundos para que el puerto se estabilice

print("Leyendo datos del PZEM004T...\n")

try:
    while True:
        line = arduino.readline().decode('utf-8').strip()
        if line:
            # Imprime la línea original
            print("Raw:", line)

            # Divide los valores por coma
            try:
                voltage, current, power = map(float, line.split(','))
                print(f"Voltaje: {voltage:.2f} V | Corriente: {current:.3f} A | Potencia: {power:.2f} W\n")
            except ValueError:
                # En caso de recibir una línea inválida (como "Error en lectura")
                print("Dato no válido recibido:", line)
        time.sleep(1)

except KeyboardInterrupt:
    print("\nLectura finalizada.")
    arduino.close()
