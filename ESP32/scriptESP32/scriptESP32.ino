#include <WiFi.h>
#include <Wire.h>
#include <TEA5767Radio.h>
#include <FastLED.h>
#include <TEA5767.h>
#include "time.h"

// Setup wifi (remplacer par vos identifiants)
const char* ssid = "le petit nom de ton wifi";
const char* password = "ton pitit mot de passe";
WiFiServer server(80);

// Setup LEDs
#define NUM_LEDS 20
#define DATA_PIN 2
#define LED_TYPE WS2812B
#define COLOR_ORDER GRB
CRGB leds[NUM_LEDS];
#define BRIGHTNESS 255

// Setup module radio
TEA5767 radio;
int heureReveil;
int minuteReveil;

// Setup pour récuperer l'heure
const char* ntpServer = "pool.ntp.org";
const long gmtOffset_sec = 3600;
const int daylightOffset_sec = 3600;
struct tm timeinfo;

void printLocalTime() {
  if (!getLocalTime(&timeinfo)) {
    Serial.println("Failed to obtain time");
    return;
  }
}

// Fonction Réveil simulateur d'aube
void ledReveil() {
  Serial.println("REVEILLL");
  int luminosite = 0;
  while (luminosite <= 100) {
    luminosite = luminosite + 1;
    FastLED.setBrightness(luminosite);
    for (int i = 0; i < NUM_LEDS; i++) {
      leds[i] = CRGB(255, 100, 0);
    }
    FastLED.show();
    delay(18000);
  }
  for (int i = 0; i < NUM_LEDS; i++) {
    leds[i] = CRGB(255, 100, 0);
  }
  FastLED.show();
  radio.setMute(false);
}

void setup() {
  // Communication
  Serial.begin(115200);
  Wire.begin();
  FastLED.addLeds<LED_TYPE, DATA_PIN, COLOR_ORDER>(leds, NUM_LEDS).setCorrection(TypicalLEDStrip);
  FastLED.setBrightness(BRIGHTNESS);
  for (int i = 0; i < NUM_LEDS; i++) {
    leds[i] = CRGB(0, 0, 0);
  }
  FastLED.show();
  WiFi.begin(ssid, password);
  Serial.print("Connexion au WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nConnecté au WiFi.");
  Serial.print("Adresse IP: ");
  Serial.println(WiFi.localIP());

  server.begin();
  radio.init();
  radio.debugEnable();
  // radio.setBandFrequency(RADIO_BAND_FM, 10550); // France info
  radio.setBandFrequency(RADIO_BAND_FM, 9530); // France inter
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  printLocalTime();
}

void loop() {
   // Check wifi
  WiFiClient client = server.available();
  if (client) {
    Serial.println("Client connecté.");

    String currentLine = "";
    String message = "";
    String valeurMessage = "";
    while (client.connected()) {
      if (client.available()) {
        char c = client.read();
        Serial.write(c);

        if (c == '\n') {
          if (currentLine.length() == 0) {
            client.println("HTTP/1.1 200 OK");
            client.println("Content-Type: application/json");
            client.println("Connection: close");
            client.println();
            client.println("{\"status\": \"Message reçu\"}");

            Serial.print("Message reçu: ");
            Serial.println(message);
            Serial.print("Valeur message: ");
            Serial.println(valeurMessage);
            break;
          } else {
            if (currentLine.startsWith("GET /?message=")) {
              message = currentLine.substring(14, 19);
              // ALLUMER ET ETTEINDRE LA LAMPE OU RADIO
              if (message == "lampe") {
                valeurMessage = currentLine.substring(19, 21);
                if (valeurMessage == "on") {
                  for (int i = 0; i < NUM_LEDS; i++) {
                    leds[i] = CRGB(250, 100, 0);
                  }
                } else {
                  for (int i = 0; i < NUM_LEDS; i++) {
                    leds[i] = CRGB(0, 0, 0);
                  }
                }
                FastLED.show();
              } else if (message == "radio") {
                valeurMessage = currentLine.substring(19, 21);
                if (valeurMessage == "on") {
                  radio.setMute(false);
                } else {
                  radio.setMute(true);
                }
              } else if (message == "color") {
                // CHANGER COULEUR LED
                valeurMessage = currentLine.substring(22, 28);
                int r, g, b;
                sscanf(valeurMessage.c_str(), "%02x%02x%02x", &r, &g, &b);
                Serial.println(r);
                Serial.println(g);
                Serial.println(b);
                for (int i = 0; i < NUM_LEDS; i++) {
                  leds[i] = CRGB(r, g, b);
                }
                FastLED.show();
              } else if (message == "alarm") {
                valeurMessage = currentLine.substring(19);
                valeurMessage = valeurMessage.substring(0, valeurMessage.indexOf(" "));
                if (valeurMessage.indexOf("%") != -1) {
                  heureReveil = valeurMessage.substring(0, valeurMessage.indexOf("%")).toInt();
                  minuteReveil = valeurMessage.substring(valeurMessage.indexOf("%") + 3).toInt();
                  Serial.print("heure : ");
                  Serial.print(heureReveil);
                  Serial.print(" | minute : ");
                  Serial.print(minuteReveil);
                }
              } else {
                // CHANGER FREQUENCE RADIO
                valeurMessage = currentLine.substring(19);
                valeurMessage = valeurMessage.substring(0, valeurMessage.indexOf(" "));
                if (valeurMessage.indexOf("%") != -1) {
                  valeurMessage = valeurMessage.substring(0, valeurMessage.indexOf("%")) + "." + valeurMessage.substring(valeurMessage.indexOf("%") + 3);
                }
                Serial.println(valeurMessage.toDouble() * 100);
                radio.setBandFrequency(RADIO_BAND_FM, (valeurMessage.toDouble() * 100));
              }
            }
            currentLine = "";
          }
        } else if (c != '\r') {
          currentLine += c;
        }
      }
    }
    client.stop();
    Serial.println("Client déconnecté.");
  }
  // Met à jour timeinfo
  printLocalTime();

  // Vérification de l'heure pour le réveil
  int adjustedHour = heureReveil;
  int adjustedMin = minuteReveil - 30;

  if (adjustedMin < 0) {
    adjustedMin += 60;
    adjustedHour--;
    if (adjustedHour < 0) {
      adjustedHour = 23;
    }
  }

  if (timeinfo.tm_hour == adjustedHour && timeinfo.tm_min == adjustedMin) {
      Serial.print("Réveil prévu à : ");
      Serial.print(adjustedHour);
      Serial.print(":");
      if (adjustedMin < 10) {
        Serial.print("0");
      }
      Serial.println(adjustedMin);
      ledReveil();
    }
    delay(200);
}
