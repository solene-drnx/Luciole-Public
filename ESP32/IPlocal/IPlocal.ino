#include <WiFi.h>

// Setup wifi (remplacer par ton wifi)
const char* ssid = "le nom de ton wifi";
const char* password = "ton piti mot de passe";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  Serial.print("Connexion au WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("Connecté au WiFi !");
  Serial.print("Adresse IP locale : ");
  Serial.println(WiFi.localIP()); 
}

void loop() {
  // Blablablablabla
}
