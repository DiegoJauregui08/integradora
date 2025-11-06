#include <SoftwareSerial.h>
#include <PZEM004Tv30.h>

SoftwareSerial pzemSW(7, 6);
PZEM004Tv30 pzem(pzemSW);

void setup() {
  Serial.begin(9600);
}

void loop() {
  float voltage = pzem.voltage();
  float current = pzem.current();
  float power = pzem.power();
  float energy = pzem.energy();
  float frequency = pzem.frequency();

  if (isnan(voltage) || isnan(current) || isnan(power) || isnan(energy) || isnan(frequency)) {
    Serial.println("Error en lectura");
  } else {
    Serial.print(voltage, 2);
    Serial.print(",");
    Serial.print(current, 3);
    Serial.print(",");
    Serial.print(power, 2);
    Serial.print(",");
    Serial.print(energy, 2);
    Serial.print(",");
    Serial.println(frequency, 2);
  }

  delay(5000);
}