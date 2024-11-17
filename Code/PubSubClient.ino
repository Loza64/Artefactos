/* Módulo RFID        ESP8266
SDA	                  D2 (GPIO 4)
SCK	                  D5 (GPIO 14)
MOSI	              D7 (GPIO 13)
MISO	              D6 (GPIO 12)
RST	                  D1 (GPIO 5)
VCC	                  3.3V
GND	                  GND
*/

/* SG90        ESP8266
Brown          (GND)
Red            (VCC)
Orange         D3
*/

#include <SPI.h>
#include <Servo.h>
#include <MFRC522.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

// PubSubClient
const char *ssid = "Loza";
const char *password = "e3dc108b83";

const char *mqtt_server = "192.168.205.37";
const char *mqtt_user = "loza";
const char *mqtt_password = "loza";

WiFiClient espClient;
PubSubClient mqttClient(espClient);

const char *subscriptions[] = {
  "/residencia/web/data/motor"
};

const char *topics[] = {
  "/residencia/people/id/data",

};

// RFID
#define SS_PIN D2
#define RST_PIN D1
#define SMOTOR D3

// Servo Motor
MFRC522 rfid(SS_PIN, RST_PIN);
Servo servo;

void Servo(int position) {
  servo.write(position);
  delay(1000);
}

// Mqtt Functions
void WifiConnection() {
  delay(10);
  Serial.printf("\nConectando a %s ", ssid);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nConectado al WiFi");
}

void Reconnect() {
  while (!mqttClient.connected()) {
    Serial.println("Conectando al broker MQTT...");
    if (mqttClient.connect("ESP-Client", mqtt_user, mqtt_password)) {
      Serial.println("Conectado al MQTT Broker");
      for (int i = 0; i < sizeof(subscriptions) / sizeof(subscriptions[0]); i++) {
        mqttClient.subscribe(subscriptions[i]);
      }
    } else {
      Serial.print("Error de conexión, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" Reintentando en 5 segundos");
      delay(5000);
    }
  }
}

void Publish(const char *topic, const char *message) {
  mqttClient.publish(topic, message);
}

void CallBack(char *topic, byte *message, unsigned int length) {
  Serial.print(topic);
  Serial.print(": ");

  String data;

  for (int i = 0; i < length; i++) {
    data += (char)message[i];
  }

  Serial.println(data);

  WebDataManage(topic, data);
}

// Dara from web
void WebDataManage(const char *topic, const String data) {
  if (strcmp(topic, subscriptions[0]) == 0) {
    if (data == "open") {
      servo.write(180);
      delay(2000);
    }
  } else if (strcmp(topic, "topic2") == 0) {
  } else if (strcmp(topic, "topic3") == 0) {
  } else if (strcmp(topic, "topic4") == 0) {
  } else {
  }
}

void setup() {
  Serial.begin(115200);
  servo.attach(SMOTOR);
  SPI.begin();
  rfid.PCD_Init();
  WifiConnection();
  mqttClient.setServer(mqtt_server, 1883);
  mqttClient.setCallback(CallBack);
}

void loop() {

  if (!mqttClient.connected()) {
    Reconnect();
  }
  mqttClient.loop();

  if (rfid.PICC_IsNewCardPresent()) {
    if (rfid.PICC_ReadCardSerial()) {
      String card = "";

      for (byte i = 0; i < rfid.uid.size; i++) {
        card += (rfid.uid.uidByte[i] < 0x10 ? " 0" : " ") + String(rfid.uid.uidByte[i], HEX);
      }
      Publish(topics[0], card.c_str());
      Serial.println(card);
      rfid.PICC_HaltA();
    }
  }
}