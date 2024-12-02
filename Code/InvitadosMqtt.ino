/* SG90          ESP8266
Brown            (GND)
Red              (VCC)
Orange           DIGITAL PIN: Visit D8 Salida D0
*/

/* Ultrasonic    ESP8266
triger           D4
echo             D3
*/

/* LED RGB INVITADOS
led Rojo D1
led Verde D2
*/

/* LED RGB SALIDA
led Rojo D5
led Verde D6
*/

/* LDR A0 */

#include <SPI.h>
#include <Servo.h>
#include <MFRC522.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

// PubSubClient
const char *ssid = "Loza";
const char *password = "e3dc108b83";

const char *mqtt_server = "192.168.5.37";
const char *mqtt_user = "loza";
const char *mqtt_password = "loza";

WiFiClient espClient;
PubSubClient mqttClient(espClient);

const char *subscriptions[] = {
  "/residencial/resident/door/",
  "/residencial/emergency",
  "/residencial/visit/door/"
};

const char *topics[] = {
  "/resident/target",
  "/residencial/visit"
};

//RFID
#define SS_PIN D2
#define RST_PIN D1
MFRC522 rfid(SS_PIN, RST_PIN);

//Servo Motor Exit
#define emotor D0
Servo ServoExit;

//Servo Motor Visit
#define vmotor D8
Servo ServoVisit;

//Ultrasonic
#define triger D4
#define echo D3

//LEDs Visit
#define lRedVisit D1
#define lGreenVisit D2

//LEDs Exit
#define lRedExit D5
#define lGreenExit D6

//LDR
#define ldr A0

//Infrarrojo
#define rf51 D7

//--------------------------------------------Infrarrojo----------------------------------------------------
void Infrared(){
  int value = digitalRead(rf51);
  if(value == 0){
    ExitDoor(180);
  }
}

//------------------------------------------------LEDs RGB-----------------------------------------------------
void RGBVisit(int led){
  int value = analogRead(ldr);
  if (value <= 250) {
    if (led != 0) {
      digitalWrite(lRedVisit, HIGH);
      digitalWrite(lGreenVisit, LOW);
    } else {
      digitalWrite(lRedVisit, LOW);
      digitalWrite(lGreenVisit, HIGH);
    }
  } else {
    digitalWrite(lRedVisit, HIGH);
    digitalWrite(lGreenVisit, HIGH);
  }
}

void RGBExit(int led){
  int value = analogRead(ldr);
  if (value <= 250) {
    if (led != 0) {
      digitalWrite(lRedExit, HIGH);
      digitalWrite(lGreenExit, LOW);
    } else {
      digitalWrite(lRedExit, LOW);
      digitalWrite(lGreenExit, HIGH);
    }
  } else {
    digitalWrite(lRedExit, HIGH);
    digitalWrite(lGreenExit, HIGH);
  }
}

//------------------------------------------------Servo Functions------------------------------------------------

void VisitDoor(int position) {
  if (position <= 180) {
    ServoVisit.write(180);
    RGBVisit(1);
    delay(5000);
    ServoVisit.write(0);
    RGBVisit(0);
  } else {
    Serial.println("Error to move servo");
  }
}

void ExitDoor(int position) {
  if (position <= 180) {
    ServoExit.write(180);
    RGBExit(1);
    delay(5000);
    ServoExit.write(0);
    RGBExit(0);
  } else {
    Serial.println("Error to move servo");
  }
}

//------------------------------------------------Ultrasonic Function------------------------------------------------
void UltraSonic() {

  digitalWrite(triger, LOW);
  delayMicroseconds(2);

  // Establece el TRIG en HIGH durante 10 ms
  digitalWrite(triger, HIGH);
  delayMicroseconds(10);
  digitalWrite(triger, LOW);

  float duration = pulseIn(echo, HIGH);

  float distance = (duration * 0.034 / 2);

  if(distance <= 10){
    Publish(topics[1], "active");
  }
}

//-------------------------------------------------Wifi Connection------------------------------------------------
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

//------------------------------------------------Mqtt Reconnection------------------------------------------------
void ReconnectMqtt() {
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

//------------------------------------------------MQTT Functions------------------------------------------------
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

//------------------------------------------------Data from web------------------------------------------------
void WebDataManage(const char *topic, const String data) {
  if (strcmp(topic, subscriptions[1]) == 0) {
    if(data == "visit"){
      VisitDoor(180);
    }
  }
  if (strcmp(topic, subscriptions[2]) == 0) {
     if(data == "open"){
      VisitDoor(180);
    }
  } 
}

void setup() {
  //Init wifi
  WifiConnection();

  //Init mqtt
  mqttClient.setServer(mqtt_server, 1883);
  mqttClient.setCallback(CallBack);

  //Init serial
  Serial.begin(115200);

  //Init servo visit
  ServoVisit.attach(vmotor);
  ServoVisit.write(0);

  //Init servo exit
  ServoExit.attach(emotor);
  ServoExit.write(0);

  //Init Ultrasonic
  pinMode(triger, OUTPUT);
  pinMode(echo, INPUT);

  //Init LEDs
  //Visit
  pinMode(lRedVisit,OUTPUT);
  pinMode(lGreenVisit,OUTPUT);
  //digitalWrite(lRedVisit,LOW);
  //digitalWrite(lGreenVisit,HIGH);
  //Exit
  pinMode(lRedExit,OUTPUT);
  pinMode(lGreenExit,OUTPUT);
  //digitalWrite(lRedExit,LOW);
  //digitalWrite(lGreenExit,HIGH);

  //Init LDR
  pinMode(ldr,INPUT);
}

void loop() {

  if (!mqttClient.connected()) {
    ReconnectMqtt();
  }
  mqttClient.loop();
  
  UltraSonic();

  Infrared();

  RGBVisit(0);
  RGBExit(0);
  
  int value = analogRead(ldr);
  Serial.println(value);
}