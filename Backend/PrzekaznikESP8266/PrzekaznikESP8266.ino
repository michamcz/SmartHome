#include <ESP8266WiFi.h>
#include <aWOT.h>
#include <EEPROM.h>
#include <ArduinoJson.h>


#define en D2
#define apPin D3

const char* ssidAP = "RelayAP";

#include <NTPClient.h>
#include <WiFiUdp.h>
const char* ntpServer = "pl.pool.ntp.org";
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, ntpServer);

unsigned long previousMillis = 0;
unsigned long interval = 20000;
unsigned long previousMillisCalendar = 0;
unsigned long intervalCalendar = 1000;
unsigned long currentMillis;

WiFiServer server(80);
Application app;

IPAddress local_IpAP(192,168,4,1);  
IPAddress gatewayAP(192,168,4,1);
IPAddress subnetAP(255,255,255,0);

void initAP(){
WiFi.mode(WIFI_AP_STA);
WiFi.softAPConfig(local_IpAP, gatewayAP, subnetAP);
WiFi.softAP(ssidAP,"123456789");
}

void initWiFi() {
  
  char ssid[64];
  char password[64];
  WiFi.mode(WIFI_STA);
  WiFi.setHostname("Przekaznik");
  EEPROM.get(2,ssid);
  EEPROM.get(66,password); 

  IPAddress local_IP(EEPROM.read(150), EEPROM.read(151), EEPROM.read(152), EEPROM.read(153));
  IPAddress gateway(EEPROM.read(160), EEPROM.read(161), EEPROM.read(162), EEPROM.read(163));
  IPAddress subnet(EEPROM.read(170), EEPROM.read(171), EEPROM.read(172), EEPROM.read(173));
  IPAddress primaryDNS(EEPROM.read(160), EEPROM.read(161), EEPROM.read(162), EEPROM.read(163));
  IPAddress secondaryDNS (8,8,8,8);

  WiFi.begin(ssid, password);
  WiFi.config(local_IP, gateway, subnet, primaryDNS, secondaryDNS);


}

void updateParams(Request &req, Response &res){
  
 char newSsid[64];
 char newPassword[64];
 char param[4];
 req.query("ssid", newSsid, 64);
 req.query("password", newPassword, 64); 

 req.query("ipA", param, 4); 
 EEPROM.write(150, atoi(param));
 req.query("ipB", param, 4); 
 EEPROM.write(151, atoi(param)); 
 req.query("ipC", param, 4); 
 EEPROM.write(152, atoi(param));
 req.query("ipD", param, 4); 
 EEPROM.write(153, atoi(param));

 req.query("gateA", param, 4);
 EEPROM.write(160, atoi(param));
 req.query("gateB", param, 4);
 EEPROM.write(161, atoi(param));
 req.query("gateC", param, 4);
 EEPROM.write(162, atoi(param));
 req.query("gateD", param, 4);
 EEPROM.write(163, atoi(param));

 req.query("maskA", param, 4);
 EEPROM.write(170, atoi(param));
 req.query("maskB", param, 4);
 EEPROM.write(171, atoi(param));
 req.query("maskC", param, 4);
 EEPROM.write(172, atoi(param));
 req.query("maskD", param, 4);
 EEPROM.write(173, atoi(param));

 EEPROM.put(2,newSsid);
 EEPROM.put(66,newPassword);
 EEPROM.commit();
 res.sendStatus(200);
 res.end();
 initWiFi();
}

void changeState(Request &req, Response &res){
  char newState[3];
  req.query("state", newState, 3);
  
  if(atoi(newState)==1){
    relayON();
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "*");
    res.set("Content-Type", "application/json");
    res.sendStatus(200);
    res.end();
  }else if(atoi(newState)==0){
    relayOFF();
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "*");
    res.set("Content-Type", "application/json");
    res.sendStatus(200);
    res.end();
  }
}

void relayON(){
  EEPROM.write(250, 1);
  EEPROM.commit();
  digitalWrite(en, HIGH);
}

void relayOFF(){
 EEPROM.write(250, 0);
 EEPROM.commit();
 digitalWrite(en, LOW);
}

void checkCalendar(){
  
  timeClient.update(); 

  int day = timeClient.getDay();
  int hour = timeClient.getHours();
  int minutes = timeClient.getMinutes();
  int seconds = timeClient.getSeconds();

  if(seconds == 0){

    switch (day) {
      case 1:
        if(EEPROM.read(501) == hour && EEPROM.read(502) == minutes){
          relayON();
        }else if(EEPROM.read(503) == hour && EEPROM.read(504) == minutes){
          relayOFF();
        }
        break;
      case 2:
        if(EEPROM.read(511) == hour && EEPROM.read(512) == minutes){
          relayON();
        }else if(EEPROM.read(513) == hour && EEPROM.read(514) == minutes){
          relayOFF();
        }
        break;
      case 3:
        if(EEPROM.read(521) == hour && EEPROM.read(522) == minutes){
         relayON();
        }else if(EEPROM.read(523) == hour && EEPROM.read(524) == minutes){
         relayOFF();
        }
        break;
      case 4:
        if(EEPROM.read(531) == hour && EEPROM.read(532) == minutes){
          relayON();
        }else if(EEPROM.read(533) == hour && EEPROM.read(534) == minutes){
          relayOFF();
        }
        break;
      case 5:
        if(EEPROM.read(541) == hour && EEPROM.read(542) == minutes){
         relayON();
        }else if(EEPROM.read(543) == hour && EEPROM.read(544) == minutes){
         relayOFF();
        }
        break;
      case 6:
        
        if(EEPROM.read(551) == hour && EEPROM.read(552) == minutes){
         relayON();
        }else if(EEPROM.read(553) == hour && EEPROM.read(554) == minutes){
         relayOFF();
        }
        break;
      case 0:

        if(EEPROM.read(561) == hour && EEPROM.read(562) == minutes){
          relayON();
        }else if(EEPROM.read(563) == hour && EEPROM.read(564) == minutes){
          relayOFF();
        }
        break;
    }
  }
}


void newCalendar(Request &req, Response &res){
 
  char newDay[3];
  char newOpenHour[3];
  char newOpenMinute[3];
  char newCloseHour[3];
  char newCloseMinute[3];
  req.query("day", newDay, 3);
  req.query("openH", newOpenHour, 3);
  req.query("openM", newOpenMinute, 3);
  req.query("closeH", newCloseHour, 3);
  req.query("closeM", newCloseMinute, 3);

  switch (atoi(newDay)) {
  case 1:
    EEPROM.write(501, atoi(newOpenHour));
    EEPROM.write(502, atoi(newOpenMinute));
    EEPROM.write(503, atoi(newCloseHour));
    EEPROM.write(504, atoi(newCloseMinute));
    break;
  case 2:
    EEPROM.write(511, atoi(newOpenHour));
    EEPROM.write(512, atoi(newOpenMinute));
    EEPROM.write(513, atoi(newCloseHour));
    EEPROM.write(514, atoi(newCloseMinute));
    break;
  case 3:
    EEPROM.write(521, atoi(newOpenHour));
    EEPROM.write(522, atoi(newOpenMinute));
    EEPROM.write(523, atoi(newCloseHour));
    EEPROM.write(524, atoi(newCloseMinute));
    break;
  case 4:
    EEPROM.write(531, atoi(newOpenHour));
    EEPROM.write(532, atoi(newOpenMinute));
    EEPROM.write(533, atoi(newCloseHour));
    EEPROM.write(534, atoi(newCloseMinute));
    break;
  case 5:
    EEPROM.write(541, atoi(newOpenHour));
    EEPROM.write(542, atoi(newOpenMinute));
    EEPROM.write(543, atoi(newCloseHour));
    EEPROM.write(544, atoi(newCloseMinute));
    break;
  case 6:
    EEPROM.write(551, atoi(newOpenHour));
    EEPROM.write(552, atoi(newOpenMinute));
    EEPROM.write(553, atoi(newCloseHour));
    EEPROM.write(554, atoi(newCloseMinute));
    break;
  case 0:
    EEPROM.write(561, atoi(newOpenHour));
    EEPROM.write(562, atoi(newOpenMinute));
    EEPROM.write(563, atoi(newCloseHour));
    EEPROM.write(564, atoi(newCloseMinute));
    break;
  }   
  EEPROM.commit();
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "*");
  res.set("Content-Type", "application/json");
  res.sendStatus(200);
  res.end();
}

void getData(Request &req, Response &res){
  
  DynamicJsonDocument currentData(1024);
  
  currentData["state"]=   EEPROM.read(250);
  
  currentData["MoOpenHour"]=   EEPROM.read(501);
  currentData["MoOpenMin"]=    EEPROM.read(502);
  currentData["MoCloseHour"]=  EEPROM.read(503);
  currentData["MoCloseMin"]=   EEPROM.read(504);

  currentData["TuOpenHour"]=   EEPROM.read(511);
  currentData["TuOpenMin"]=    EEPROM.read(512);
  currentData["TuCloseHour"]=  EEPROM.read(513);
  currentData["TuCloseMin"]=   EEPROM.read(514);

  currentData["WeOpenHour"]=   EEPROM.read(521);
  currentData["WeOpenMin"]=    EEPROM.read(522);
  currentData["WeCloseHour"]=  EEPROM.read(523);
  currentData["WeCloseMin"]=   EEPROM.read(524);

  currentData["ThOpenHour"]=   EEPROM.read(531);
  currentData["ThOpenMin"]=    EEPROM.read(532);
  currentData["ThCloseHour"]=  EEPROM.read(533);
  currentData["ThCloseMin"]=   EEPROM.read(534);

  currentData["FrOpenHour"]=   EEPROM.read(541);
  currentData["FrOpenMin"]=    EEPROM.read(542);
  currentData["FrCloseHour"]=  EEPROM.read(543);
  currentData["FrCloseMin"]=   EEPROM.read(544);

  currentData["SaOpenHour"]=   EEPROM.read(551);
  currentData["SaOpenMin"]=    EEPROM.read(552);
  currentData["SaCloseHour"]=  EEPROM.read(553);
  currentData["SaCloseMin"]=   EEPROM.read(554);

  currentData["SuOpenHour"]=   EEPROM.read(561);
  currentData["SuOpenMin"]=    EEPROM.read(562);
  currentData["SuCloseHour"]=  EEPROM.read(563);
  currentData["SuCloseMin"]=   EEPROM.read(564);

  currentData["whatAmI"]= 3;
  
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "*");
  res.set("Content-Type", "application/json");

  String buffor;
  serializeJson(currentData, buffor);
  res.status(200);
  res.print(buffor);
  res.end();
}

void setup() {
  
  Serial.begin(9600);
  EEPROM.begin(800);

  pinMode(en, OUTPUT);
  pinMode(apPin, INPUT_PULLUP);
  app.get("/UPDATE", &updateParams);
  app.get("/CHANGE", &changeState);
  app.get("/CALENDAR", &newCalendar);
  app.get("/GETDATA", &getData);
  server.begin();
  
  if(digitalRead(apPin) == LOW){ 
    initAP();
  }else{
    initWiFi();
  }
  int x = EEPROM.read(250);
  
  if(x==255){
    EEPROM.write(250, 0);
    EEPROM.commit();
    }else if(x==1){
      relayON();
    }else if(x==0){
      relayOFF();
    }
     timeClient.begin();
     timeClient.setTimeOffset(7200);
  }

void loop() { 


  currentMillis = millis();
  WiFiClient client = server.available();
  if (client.connected()) {
    app.process(&client);
    client.stop();
  }

  
  if ((WiFi.status() != WL_CONNECTED) && (currentMillis - previousMillis >=interval && digitalRead(apPin) != LOW )) {
    WiFi.disconnect();
    WiFi.reconnect();
    previousMillis = currentMillis;
  }

  
 if(currentMillis - previousMillisCalendar >=intervalCalendar){
  previousMillisCalendar = currentMillis;
  checkCalendar();
 }
 
}
