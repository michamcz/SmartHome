#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <Hash.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <Adafruit_Sensor.h>
#include <AsyncJson.h>
#include <ArduinoJson.h>
#include <EEPROM.h>

#include <Wire.h>
#include <Adafruit_BMP280.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>

#define apPin D7 //Access point mode

//wifi settings
const char* ssid = "";
const char* password = "";

//sensors objects
DHT dht( D5, DHT22);
Adafruit_BMP280 bmp; // I2C SCL - D1,SDA - D2

// Current measurements, updated in loop()
float tempBMP280 = 0.0;
float tempDHT22 = 0.0;
float humidity = 0.0;
float pressure = 0.0;

// Create AsyncWebServer object on port 80
 AsyncWebServer server(80);

//Updates interval (2s)
unsigned long previousMillis = 0; 
const long interval = 5000;

//AP settings
IPAddress local_IpAP(192,168,4,1);  
IPAddress gatewayAP(192,168,4,1);
IPAddress subnetAP(255,255,255,0);

void initAP(){
  //Access Point mode
  const char* ssidAP = "PogodaAP";
  Serial.println("starting access point");
  WiFi.mode(WIFI_AP_STA);
  WiFi.softAPConfig(local_IpAP, gatewayAP, subnetAP);
  WiFi.softAP(ssidAP,"123456789");
}

void initClient() {
  // Configure and connect to Wi-Fi
  char ssid[64];
  char password[64];
  
  WiFi.mode(WIFI_STA);
  
  EEPROM.get(2,ssid);
  EEPROM.get(66,password);
  
  IPAddress local_IP(EEPROM.read(150), EEPROM.read(155), EEPROM.read(160), EEPROM.read(165));
  IPAddress gateway(EEPROM.read(170), EEPROM.read(175), EEPROM.read(180), EEPROM.read(185));
  IPAddress subnet(EEPROM.read(190), EEPROM.read(195), EEPROM.read(200), EEPROM.read(205));
  IPAddress primaryDNS(8,8,8,8);
  IPAddress secondaryDNS (8,8,4,4);

  WiFi.begin(ssid, password);
  WiFi.config(local_IP, gateway, subnet, primaryDNS, secondaryDNS);
  
  Serial.println("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println(".");
  }
  
  // Print ESP8266 Local IP Address
  Serial.println(WiFi.localIP());
}

void setup() {

  pinMode(D7, INPUT_PULLUP);
  
  Serial.begin(9600);
  while ( !Serial ) delay(100);   // wait for native usb
  unsigned status;
  Serial.println("RRPROM before begin");
  EEPROM.begin(800);
  Serial.println("RRPROM begin");

  //init BMP280
  status = bmp.begin(0x76);      // I2C address
  if (!status) {
    Serial.println(F("Could not find a valid BMP280 sensor"));
    while (1) delay(10);
  }
  
  //init DHT
  dht.begin();

  // Route for data request handling
  server.on("/GETDATA", HTTP_GET, [](AsyncWebServerRequest *request){
    AsyncResponseStream *response = request->beginResponseStream("application/json");
    DynamicJsonDocument doc(1024); 
    doc["tempDHT22"] = tempDHT22;
    doc["tempBMP280"] = tempBMP280;
    doc["humidity"] = humidity;
    doc["pressure"] = pressure;
    doc["whatAmI"] = 4;
  serializeJson(doc, *response);    
  request->send(response);
  });

  // Route for network params update
  server.on("/UPDATE", HTTP_GET, [](AsyncWebServerRequest *request){
      char newSsid[64];
      char newPassword[64];
      char param[4];
            AsyncWebParameter* ssid = request->getParam("ssid");
      strcpy(newSsid,ssid->value().c_str());
      EEPROM.put(2, newSsid);
            AsyncWebParameter* password = request->getParam("password");
      strcpy(newPassword,password->value().c_str());
      EEPROM.put(66, newPassword);
            AsyncWebParameter* ipA = request->getParam("ipA");
      strcpy(param,ipA->value().c_str());
      EEPROM.write(150, atoi(param));
            AsyncWebParameter* ipB = request->getParam("ipB");
      strcpy(param,ipB->value().c_str());
      EEPROM.write(155, atoi(param));
            AsyncWebParameter* ipC = request->getParam("ipC");
      strcpy(param,ipC->value().c_str());
      EEPROM.write(160, atoi(param));
            AsyncWebParameter* ipD = request->getParam("ipD");
      strcpy(param,ipD->value().c_str());
      EEPROM.write(165, atoi(param));
            AsyncWebParameter* gateA = request->getParam("gateA");
      strcpy(param,gateA->value().c_str());
      EEPROM.write(170, atoi(param));
            AsyncWebParameter* gateB = request->getParam("gateB");
      strcpy(param,gateB->value().c_str());
      EEPROM.write(175, atoi(param));
            AsyncWebParameter* gateC = request->getParam("gateC");
      strcpy(param,gateC->value().c_str());
      EEPROM.write(180, atoi(param));
            AsyncWebParameter* gateD = request->getParam("gateD");
      strcpy(param,gateD->value().c_str());
      EEPROM.write(185, atoi(param));
            AsyncWebParameter* maskA = request->getParam("maskA");
      strcpy(param,maskA->value().c_str());
      EEPROM.write(190, atoi(param));
            AsyncWebParameter* maskB = request->getParam("maskB");
      strcpy(param,maskB->value().c_str());
      EEPROM.write(195, atoi(param));
            AsyncWebParameter* maskC = request->getParam("maskC");
      strcpy(param,maskC->value().c_str());
      EEPROM.write(200, atoi(param));
            AsyncWebParameter* maskD = request->getParam("maskD");
      strcpy(param,maskD->value().c_str());
      EEPROM.write(205, atoi(param));
      
      EEPROM.commit();
      request->send(200, "text/plain", "New config done!!");

      initClient();
  });

  //Decide AP or WIFI mode
   if(digitalRead(apPin) == LOW){ 
      initAP();
   }else{
      initClient();
   }
   
 DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*"); 
 server.begin();
 }

void loop() {
  //update values and print to serial
  unsigned long currentMillis = millis();

  //Wifi reconnect
  if ((WiFi.status() != WL_CONNECTED) && (currentMillis - previousMillis >=interval && digitalRead(apPin) != LOW )) {
    WiFi.disconnect();
    WiFi.reconnect();
    previousMillis = currentMillis;
  }
  
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;
    float newT_DHT22 = dht.readTemperature();
    if (isnan(newT_DHT22)) {
      Serial.println("Failed to read temperature from DHT22 sensor");
    }
    else {
      tempDHT22 = newT_DHT22;
      Serial.print(F("DTH22 Temperature: "));
      Serial.print(newT_DHT22);
      Serial.println(F("°C"));
    }
    float newH = dht.readHumidity();
    if (isnan(newH)) {
      Serial.println("Failed to read humidity from DHT22 sensor");
    }
    else {
      humidity = newH;
      Serial.print(F("DTH22 Humidity: "));
      Serial.print(newH);
      Serial.println(F("%"));
      
    }
    float newT_BMP = bmp.readTemperature();   
    if (isnan(newT_BMP)) {
      Serial.println("Failed to read temperature from BMP sensor");
    }
    else {
      tempBMP280 = newT_BMP;
      Serial.print(F("BMP280 temperature: "));
      Serial.print(newT_BMP);
      Serial.println(F(" *C"));
    }
    float newP = bmp.readPressure()/100;   
    if (isnan(newP)) {
      Serial.println("Failed to read pressure from BMP sensor");
    }
    else {
      pressure = newP;
      Serial.print(F("BMP280 pressure: "));
      Serial.print(newP);
      Serial.println(" hPa");
    }
    Serial.println();  
  }
}
