#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <Hash.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <AsyncJson.h>
#include <ArduinoJson.h>
#include <EEPROM.h>
#define FASTLED_INTERRUPT_RETRY_COUNT 0
#include <FastLED.h>

#define ledData D4
#define apPin D2

//WLED options
int NUM_LEDS = 120;
CRGB leds[120];

#define UPDATES_PER_SECOND 500

CRGBPalette16 currentPalette;
TBlendType    currentBlending;

extern CRGBPalette16 myRedWhiteBluePalette;
extern const TProgmemPalette16 myRedWhiteBluePalette_p PROGMEM;

byte Palette=0;
byte Brightness = 0;
byte selectedEffect=0;
byte red=0;
byte green=0;
byte blue=0;
byte ledSpeed = 0;

int fadeAmount = 5;
int brightness = 0;

//gradients table
extern const TProgmemRGBGradientPalettePtr gGradientPalettes[];

DEFINE_GRADIENT_PALETTE( ib_jul01_gp ) {
    0, 194,  1,  1,
   94,   1, 29, 18,
  132,  57,131, 28,
  255, 113,  1,  1};

DEFINE_GRADIENT_PALETTE( es_vintage_57_gp ) {
    0,   2,  1,  1,
   53,  18,  1,  0,
  104,  69, 29,  1,
  153, 167,135, 10,
  255,  46, 56,  4};

DEFINE_GRADIENT_PALETTE( es_vintage_01_gp ) {
    0,   4,  1,  1,
   51,  16,  0,  1,
   76,  97,104,  3,
  101, 255,131, 19,
  127,  67,  9,  4,
  153,  16,  0,  1,
  229,   4,  1,  1,
  255,   4,  1,  1};

DEFINE_GRADIENT_PALETTE( es_rivendell_15_gp ) {
    0,   1, 14,  5,
  101,  16, 36, 14,
  165,  56, 68, 30,
  242, 150,156, 99,
  255, 150,156, 99};

DEFINE_GRADIENT_PALETTE( rgi_15_gp ) {
    0,   4,  1, 31,
   31,  55,  1, 16,
   63, 197,  3,  7,
   95,  59,  2, 17,
  127,   6,  2, 34,
  159,  39,  6, 33,
  191, 112, 13, 32,
  223,  56,  9, 35,
  255,  22,  6, 38};

DEFINE_GRADIENT_PALETTE( retro2_16_gp ) {
    0, 188,135,  1,
  255,  46,  7,  1};

DEFINE_GRADIENT_PALETTE( Analogous_1_gp ) {
    0,   3,  0,255,
   63,  23,  0,255,
  127,  67,  0,255,
  191, 142,  0, 45,
  255, 255,  0,  0};

DEFINE_GRADIENT_PALETTE( es_pinksplash_08_gp ) {
    0, 126, 11,255,
  127, 197,  1, 22,
  175, 210,157,172,
  221, 157,  3,112,
  255, 157,  3,112};

DEFINE_GRADIENT_PALETTE( es_pinksplash_07_gp ) {
    0, 229,  1,  1,
   61, 242,  4, 63,
  101, 255, 12,255,
  127, 249, 81,252,
  153, 255, 11,235,
  193, 244,  5, 68,
  255, 232,  1,  5};

DEFINE_GRADIENT_PALETTE( Coral_reef_gp ) {
    0,  40,199,197,
   50,  10,152,155,
   96,   1,111,120,
   96,  43,127,162,
  139,  10, 73,111,
  255,   1, 34, 71};

DEFINE_GRADIENT_PALETTE( es_ocean_breeze_068_gp ) {
    0, 100,156,153,
   51,   1, 99,137,
  101,   1, 68, 84,
  104,  35,142,168,
  178,   0, 63,117,
  255,   1, 10, 10};

DEFINE_GRADIENT_PALETTE( es_ocean_breeze_036_gp ) {
    0,   1,  6,  7,
   89,   1, 99,111,
  153, 144,209,255,
  255,   0, 73, 82};

DEFINE_GRADIENT_PALETTE( departure_gp ) {
    0,   8,  3,  0,
   42,  23,  7,  0,
   63,  75, 38,  6,
   84, 169, 99, 38,
  106, 213,169,119,
  116, 255,255,255,
  138, 135,255,138,
  148,  22,255, 24,
  170,   0,255,  0,
  191,   0,136,  0,
  212,   0, 55,  0,
  255,   0, 55,  0};

DEFINE_GRADIENT_PALETTE( es_landscape_64_gp ) {
    0,   0,  0,  0,
   37,   2, 25,  1,
   76,  15,115,  5,
  127,  79,213,  1,
  128, 126,211, 47,
  130, 188,209,247,
  153, 144,182,205,
  204,  59,117,250,
  255,   1, 37,192};

DEFINE_GRADIENT_PALETTE( es_landscape_33_gp ) {
    0,   1,  5,  0,
   19,  32, 23,  1,
   38, 161, 55,  1,
   63, 229,144,  1,
   66,  39,142, 74,
  255,   1,  4,  1};

DEFINE_GRADIENT_PALETTE( rainbowsherbet_gp ) {
    0, 255, 33,  4,
   43, 255, 68, 25,
   86, 255,  7, 25,
  127, 255, 82,103,
  170, 255,255,242,
  209,  42,255, 22,
  255,  87,255, 65};

DEFINE_GRADIENT_PALETTE( gr65_hult_gp ) {
    0, 247,176,247,
   48, 255,136,255,
   89, 220, 29,226,
  160,   7, 82,178,
  216,   1,124,109,
  255,   1,124,109};

DEFINE_GRADIENT_PALETTE( gr64_hult_gp ) {
    0,   1,124,109,
   66,   1, 93, 79,
  104,  52, 65,  1,
  130, 115,127,  1,
  150,  52, 65,  1,
  201,   1, 86, 72,
  239,   0, 55, 45,
  255,   0, 55, 45};

DEFINE_GRADIENT_PALETTE( GMT_drywet_gp ) {
    0,  47, 30,  2,
   42, 213,147, 24,
   84, 103,219, 52,
  127,   3,219,207,
  170,   1, 48,214,
  212,   1,  1,111,
  255,   1,  7, 33};

DEFINE_GRADIENT_PALETTE( ib15_gp ) {
    0, 113, 91,147,
   72, 157, 88, 78,
   89, 208, 85, 33,
  107, 255, 29, 11,
  141, 137, 31, 39,
  255,  59, 33, 89};

DEFINE_GRADIENT_PALETTE( Fuschia_7_gp ) {
    0,  43,  3,153,
   63, 100,  4,103,
  127, 188,  5, 66,
  191, 161, 11,115,
  255, 135, 20,182};

DEFINE_GRADIENT_PALETTE( es_emerald_dragon_08_gp ) {
    0,  97,255,  1,
  101,  47,133,  1,
  178,  13, 43,  1,
  255,   2, 10,  1};

DEFINE_GRADIENT_PALETTE( lava_gp ) {
    0,   0,  0,  0,
   46,  18,  0,  0,
   96, 113,  0,  0,
  108, 142,  3,  1,
  119, 175, 17,  1,
  146, 213, 44,  2,
  174, 255, 82,  4,
  188, 255,115,  4,
  202, 255,156,  4,
  218, 255,203,  4,
  234, 255,255,  4,
  244, 255,255, 71,
  255, 255,255,255};

DEFINE_GRADIENT_PALETTE( fire_gp ) {
    0,   1,  1,  0,
   76,  32,  5,  0,
  146, 192, 24,  0,
  197, 220,105,  5,
  240, 252,255, 31,
  250, 252,255,111,
  255, 255,255,255};

DEFINE_GRADIENT_PALETTE( Colorfull_gp ) {
    0,  10, 85,  5,
   25,  29,109, 18,
   60,  59,138, 42,
   93,  83, 99, 52,
  106, 110, 66, 64,
  109, 123, 49, 65,
  113, 139, 35, 66,
  116, 192,117, 98,
  124, 255,255,137,
  168, 100,180,155,
  255,  22,121,174};

DEFINE_GRADIENT_PALETTE( Magenta_Evening_gp ) {
    0,  71, 27, 39,
   31, 130, 11, 51,
   63, 213,  2, 64,
   70, 232,  1, 66,
   76, 252,  1, 69,
  108, 123,  2, 51,
  255,  46,  9, 35};

DEFINE_GRADIENT_PALETTE( Pink_Purple_gp ) {
    0,  19,  2, 39,
   25,  26,  4, 45,
   51,  33,  6, 52,
   76,  68, 62,125,
  102, 118,187,240,
  109, 163,215,247,
  114, 217,244,255,
  122, 159,149,221,
  149, 113, 78,188,
  183, 128, 57,155,
  255, 146, 40,123};

DEFINE_GRADIENT_PALETTE( Sunset_Real_gp ) {
    0, 120,  0,  0,
   22, 179, 22,  0,
   51, 255,104,  0,
   85, 167, 22, 18,
  135, 100,  0,103,
  198,  16,  0,130,
  255,   0,  0,160};

DEFINE_GRADIENT_PALETTE( es_autumn_19_gp ) {
    0,  26,  1,  1,
   51,  67,  4,  1,
   84, 118, 14,  1,
  104, 137,152, 52,
  112, 113, 65,  1,
  122, 133,149, 59,
  124, 137,152, 52,
  135, 113, 65,  1,
  142, 139,154, 46,
  163, 113, 13,  1,
  204,  55,  3,  1,
  249,  17,  1,  1,
  255,  17,  1,  1};

DEFINE_GRADIENT_PALETTE( BlacK_Blue_Magenta_White_gp ) {
    0,   0,  0,  0,
   42,   0,  0, 45,
   84,   0,  0,255,
  127,  42,  0,255,
  170, 255,  0,255,
  212, 255, 55,255,
  255, 255,255,255};

DEFINE_GRADIENT_PALETTE( BlacK_Magenta_Red_gp ) {
    0,   0,  0,  0,
   63,  42,  0, 45,
  127, 255,  0,255,
  191, 255,  0, 45,
  255, 255,  0,  0};

DEFINE_GRADIENT_PALETTE( BlacK_Red_Magenta_Yellow_gp ) {
    0,   0,  0,  0,
   42,  42,  0,  0,
   84, 255,  0,  0,
  127, 255,  0, 45,
  170, 255,  0,255,
  212, 255, 55, 45,
  255, 255,255,  0};

DEFINE_GRADIENT_PALETTE( Blue_Cyan_Yellow_gp ) {
    0,   0,  0,255,
   63,   0, 55,255,
  127,   0,255,255,
  191,  42,255, 45,
  255, 255,255,  0};

const TProgmemRGBGradientPalettePtr gGradientPalettes[] = {
  Sunset_Real_gp,
  es_rivendell_15_gp,
  es_ocean_breeze_036_gp,
  rgi_15_gp,
  retro2_16_gp,
  Analogous_1_gp,
  es_pinksplash_08_gp,
  Coral_reef_gp,
  es_ocean_breeze_068_gp,
  es_pinksplash_07_gp,
  es_vintage_01_gp,
  departure_gp,
  es_landscape_64_gp,
  es_landscape_33_gp,
  rainbowsherbet_gp,
  gr65_hult_gp,
  gr64_hult_gp,
  GMT_drywet_gp,
  ib_jul01_gp,
  es_vintage_57_gp,
  ib15_gp,
  Fuschia_7_gp,
  es_emerald_dragon_08_gp,
  lava_gp,
  fire_gp,
  Colorfull_gp,
  Magenta_Evening_gp,
  Pink_Purple_gp,
  es_autumn_19_gp,
  BlacK_Blue_Magenta_White_gp,
  BlacK_Magenta_Red_gp,
  BlacK_Red_Magenta_Yellow_gp,
  Blue_Cyan_Yellow_gp };

// Create AsyncWebServer object on port 80
 AsyncWebServer server(80);

//Updates interval (2s)
unsigned long previousMillis = 0;
unsigned long interval = 20000;
unsigned long currentMillis;

//wifi settings
const char* ssid = "KatedraMetrologii";
const char* password = "123456789";

//AP settings
IPAddress local_IpAP(192,168,4,1);  
IPAddress gatewayAP(192,168,4,1);
IPAddress subnetAP(255,255,255,0);

void initAP(){
  //Access Point mode
  const char* ssidAP = "LedyAP";
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
  //WiFi.setHostname("Pogoda");

  EEPROM.get(2,ssid);
  EEPROM.get(66,password);
//  Serial.println(EEPROM.read(150));
//  Serial.println(EEPROM.read(155));
//  Serial.println(EEPROM.read(160));
//  Serial.println(EEPROM.read(165));
//  Serial.println(EEPROM.read(170));
//  Serial.println(EEPROM.read(175));
//  Serial.println(EEPROM.read(180));
//  Serial.println(EEPROM.read(185));
//  Serial.println(EEPROM.read(190));
//  Serial.println(EEPROM.read(195));
//  Serial.println(EEPROM.read(200));
//  Serial.println(EEPROM.read(205));
//  
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

  pinMode(apPin, INPUT_PULLUP);
  pinMode(ledData, OUTPUT);
  
  Serial.begin(9600);
  while ( !Serial ) delay(100);   // wait for native usb
  unsigned status;
  
  EEPROM.begin(800);

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

   server.on("/COLOR", HTTP_GET, [](AsyncWebServerRequest *request){
     char newRedColor[4];
     char newGreenColor[4];
     char newBlueColor[4];
     
     AsyncWebParameter* redColor = request->getParam("redColor");
      strcpy(newRedColor,redColor->value().c_str());
      EEPROM.write(250, atoi(newRedColor));
     AsyncWebParameter* greenColor = request->getParam("greenColor");
      strcpy(newGreenColor,greenColor->value().c_str());
      EEPROM.write(255, atoi(newGreenColor));
     AsyncWebParameter* blueColor = request->getParam("blueColor");
      strcpy(newBlueColor,blueColor->value().c_str());
      EEPROM.write(260, atoi(newBlueColor));
      EEPROM.commit();
      
      red = EEPROM.read(250);
      green = EEPROM.read(255);
      blue = EEPROM.read(260);
      
     request->send(200, "text/plain", "New color set!!");
   });

  server.on("/PATTERN", HTTP_GET, [](AsyncWebServerRequest *request){
    char newPattern[4];
    
    AsyncWebParameter* pattern = request->getParam("pattern");
     strcpy(newPattern,pattern->value().c_str());
     selectedEffect = atoi(newPattern);
     EEPROM.write(265, atoi(newPattern));

    EEPROM.commit();
    request->send(200, "text/plain", "New pattern set!!");
   });
   
   server.on("/AMOUNTLED", HTTP_GET, [](AsyncWebServerRequest *request){
     char newAmountLed[4];
     AsyncWebParameter* amountLed = request->getParam("amountLed");
      strcpy(newAmountLed,amountLed->value().c_str());
      for( int i =  atoi(newAmountLed); i <= NUM_LEDS; i++) {
         leds[i] = 0;   
      }
      FastLED.show();
      NUM_LEDS = atoi(newAmountLed);
      EEPROM.write(270, atoi(newAmountLed));

    EEPROM.commit();
    request->send(200, "text/plain", "New led amount set!!");
   });

   server.on("/BRIGHTNESS", HTTP_GET, [](AsyncWebServerRequest *request){
     char newBrightness[4];
    
     AsyncWebParameter* brightness = request->getParam("brightness");
      strcpy(newBrightness,brightness->value().c_str());
      Brightness = atoi(newBrightness);
      EEPROM.write(275, atoi(newBrightness));

    EEPROM.commit();
    request->send(200, "text/plain", "New brightness set!!");
    //espReset = 1;
   });

   server.on("/PALETTE", HTTP_GET, [](AsyncWebServerRequest *request){
     char newPaleete[4];
    
     AsyncWebParameter* paleete = request->getParam("palette");
      strcpy(newPaleete,paleete->value().c_str());
      Palette = atoi(newPaleete);
      EEPROM.write(280, atoi(newPaleete));

    EEPROM.commit();
    request->send(200, "text/plain", "New paleete set!!");
    //espReset = 1;
   });
   server.on("/SPEED", HTTP_GET, [](AsyncWebServerRequest *request){
     char newSpeed[4];
    
     AsyncWebParameter* speed1 = request->getParam("speed");
      strcpy(newSpeed,speed1->value().c_str());
      EEPROM.write(285, atoi(newSpeed));
      EEPROM.commit();
      
    ledSpeed = EEPROM.read(285);
    request->send(200, "text/plain", "New speed set!!");
    //espReset = 1;
   });

  // Route for data request handling
  server.on("/GETDATA", HTTP_GET, [](AsyncWebServerRequest *request){
    AsyncResponseStream *response = request->beginResponseStream("application/json");
    DynamicJsonDocument doc(1024); 
    doc["currentRedColor"] = EEPROM.read(250);
    doc["currentGreenColor"] = EEPROM.read(255);
    doc["currentBlueColor"] = EEPROM.read(260);
    doc["currentPattern"] = EEPROM.read(265);
    doc["currentAmountLed"] = EEPROM.read(270);
    doc["currentBrightness"] = EEPROM.read(275);
    doc["currentPaleete"] = EEPROM.read(280);
    doc["currentSpeed"] = EEPROM.read(285);
    doc["whatAmI"] = 2;
  serializeJson(doc, *response);    
  request->send(response);
  });

  //Decide AP or WIFI mode
   if(digitalRead(apPin) == LOW){ 
      initAP();
   }else{
      initClient();
   }
 
 DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*"); 
 server.begin();

  FastLED.addLeds<WS2812B, ledData, GRB>(leds, NUM_LEDS).setCorrection( TypicalLEDStrip );
  CRGBPalette16 currentPalette;
  TBlendType    currentBlending;

  red = EEPROM.read(250);
  green = EEPROM.read(255);
  blue = EEPROM.read(260);
  selectedEffect = EEPROM.read(265);
  NUM_LEDS = EEPROM.read(270);
  Brightness = EEPROM.read(275);
  Palette = EEPROM.read(280);
  ledSpeed = EEPROM.read(285);

  

//    EEPROM.put(200,1); 
//    EEPROM.put(210,1);
//    EEPROM.write(250, 1);
//    EEPROM.write(255, 1);
//    EEPROM.write(260, 1);
//    EEPROM.write(265, 1);
//    EEPROM.write(270, 1);
//    EEPROM.write(275, 1);
//    EEPROM.write(280, 1);
//    EEPROM.write(285, 100);
//    EEPROM.write(300, 0);
//    EEPROM.commit();
}

void loop() { 

  currentPalette = gGradientPalettes[Palette];
  currentMillis = millis();
  
  
  if ((WiFi.status() != WL_CONNECTED) && (currentMillis - previousMillis >=interval && digitalRead(apPin) != LOW )) {
    WiFi.disconnect();
    WiFi.reconnect();
    previousMillis = currentMillis;
    EEPROM.write(300,0);
    EEPROM.commit();
  }

  FastLED.setBrightness(Brightness);

  switch(selectedEffect) {
     case 0  : {
                OFF();
                break;
              }
    case 1  : {
                currentBlending = LINEARBLEND;
                static uint8_t startIndex = 0;
                startIndex = startIndex + 1; /* motion speed */
                FillLEDsFromPaletteColors(startIndex);
                break;
              }
    case 2 : {
                OneColor();
                break;
              }          
    case 3 : {
                currentPalette = RainbowColors_p;
                currentBlending = LINEARBLEND;
                static uint8_t startIndex = 0;
                startIndex = startIndex + 1; 
                FillLEDsFromPaletteColors(startIndex);
                break;
              }            
    case 4 : {
                delay(ledSpeed);
                pulseColor();
                break;
              }
              
    case 5 : {
               colorWipe(red,green,blue, ledSpeed);
               colorWipe(0x00,0x00,0x00, ledSpeed);
               break;
              }
       
    case 6  : {
               delay(ledSpeed);
               Sparkle(red, green, blue, 10);
                break;
              }            
    case 7  : {
                delay(ledSpeed);
                theaterChase(red,green,blue,0);
                break;
              }     
    case 8  : {
               RunningLights(red,green,blue, ledSpeed);
                break;
              }  
    case 9  : {
                meteorRain(red,green,blue,10, 64, true, ledSpeed);
                break;
              }  
    case 10  : {
                Fire(55,120,ledSpeed);
                break;
              }         

  }
   FastLED.show();
   FastLED.delay(1000 / UPDATES_PER_SECOND); 
}

//.......................................................................................................................

void OFF( )
{
    for( int i = 0; i < NUM_LEDS; i++) {
        leds[i] = 0;   
    }
}

void FillLEDsFromPaletteColors( uint8_t colorIndex)
{
    delay(ledSpeed);
    for( int i = 0; i < NUM_LEDS; i++) {
        uint8_t brightness = 255;
        leds[i] = ColorFromPalette( currentPalette, colorIndex, brightness, currentBlending);
        colorIndex += 3;
    }
}

void OneColor()
{
    delay(ledSpeed);
    for( int i = 0; i < NUM_LEDS; i++) {
             leds[i].setRGB(red,green,blue);
    }
}

void pulseColor()
{
   for(int i = 0; i < NUM_LEDS; i++ )
   {
   leds[i].setRGB(red,green,blue);                            
   leds[i].fadeLightBy(brightness);
  }
  brightness = brightness + fadeAmount;
  // reverse the direction of the fading at the ends of the fade:
  if(brightness == 0 || brightness == 255)
  {
   fadeAmount = -fadeAmount ;
  }  
}


void Sparkle(byte red, byte green, byte blue, int SpeedDelay) {
  int PixelOne = random(NUM_LEDS);
  int PixelTwo = random(NUM_LEDS);
  int PixelThree = random(NUM_LEDS);
  leds[PixelOne].setRGB(red,green,blue);
  delay(SpeedDelay);
  FastLED.show();
  leds[PixelTwo].setRGB(red,green,blue);
  delay(SpeedDelay);
  FastLED.show();
  leds[PixelThree].setRGB(red,green,blue);
  FastLED.show();
  delay(SpeedDelay);
  leds[PixelOne].setRGB(0,0,0);
  delay(SpeedDelay);
  FastLED.show();
  leds[PixelTwo].setRGB(0,0,0);
  delay(SpeedDelay);
  FastLED.show();
  leds[PixelThree].setRGB(0,0,0);
  delay(SpeedDelay);
  FastLED.show();
}

void colorWipe(byte red, byte green, byte blue, int SpeedDelay) {
  for(uint16_t i=0; i<NUM_LEDS; i++) {
      leds[i].setRGB(red, green, blue);
      FastLED.show();
      delay(SpeedDelay);
  }
}

void theaterChase(byte red, byte green, byte blue, int SpeedDelay) {
    for( int i = 0; i < NUM_LEDS; i++) {
             leds[i].setRGB(red,green,blue);
    }
    for(int i = 0; i < NUM_LEDS; i++) {
      leds[i].setRGB (red,green,blue);
      leds[i].setRGB (255,255,255);
      FastLED.show();
      FastLED.delay(25);
      leds[i].setRGB (red,green,blue);
     }
}

void RunningLights(byte red, byte green, byte blue, int WaveDelay) {
  int Position=0;
 
  for(int j=0; j<NUM_LEDS; j++)
  {

      Position++; // = 0; //Position + Rate;
      for(int i=0; i<NUM_LEDS; i++) {

        leds[i].setRGB(((sin(i+Position) * 127 + 128)/255)*red,
                   ((sin(i+Position) * 127 + 128)/255)*green,
                   ((sin(i+Position) * 127 + 128)/255)*blue);
      }
     
      FastLED.show();
      delay(WaveDelay+10);   
  }
}



void Fire(int Cooling, int Sparking, int SpeedDelay) {
  static byte heat[120];
  int cooldown;
 
  // Step 1.  Cool down every cell a little
  for( int i = 0; i < NUM_LEDS; i++) {
    cooldown = random(0, ((Cooling * 10) / NUM_LEDS) + 2);
   
    if(cooldown>heat[i]) {
      heat[i]=0;
    } else {
      heat[i]=heat[i]-cooldown;
    }
  }
 
  // Step 2.  Heat from each cell drifts 'up' and diffuses a little
  for( int k= NUM_LEDS - 1; k >= 2; k--) {
    heat[k] = (heat[k - 1] + heat[k - 2] + heat[k - 2]) / 3;
  }
   
  // Step 3.  Randomly ignite new 'sparks' near the bottom
  if( random(255) < Sparking ) {
    int y = random(7);
    heat[y] = heat[y] + random(160,255);
    //heat[y] = random(160,255);
  }

  // Step 4.  Convert heat to LED colors
  for( int j = 0; j < NUM_LEDS; j++) {
    setPixelHeatColor(j, heat[j] );
  }

  FastLED.show();
  delay(SpeedDelay);
}

void setPixelHeatColor (int Pixel, byte temperature) {
  // Scale 'heat' down from 0-255 to 0-191
  byte t192 = round((temperature/255.0)*191);
 
  // calculate ramp up from
  byte heatramp = t192 & 0x3F; // 0..63
  heatramp <<= 2; // scale up to 0..252
 
  // figure out which third of the spectrum we're in:
  if( t192 > 0x80) {                     // hottest
    leds[Pixel].setRGB( 255, 255, heatramp);
  } else if( t192 > 0x40 ) {             // middle
    leds[Pixel].setRGB(255, heatramp, 0);
  } else {                               // coolest
    leds[Pixel].setRGB(heatramp, 0, 0);
  }
}



void meteorRain(byte red, byte green, byte blue, byte meteorSize, byte meteorTrailDecay, boolean meteorRandomDecay, int SpeedDelay) {  
   for( int i = 0; i < NUM_LEDS; i++) {
             leds[i].setRGB(0,0,0);
    }
 
  for(int i = 0; i < NUM_LEDS+NUM_LEDS; i++) {
    // fade brightness all LEDs one step
    for(int j=0; j<NUM_LEDS; j++) {
      if( (!meteorRandomDecay) || (random(10)>5) ) {
        fadeToBlack(j, meteorTrailDecay );        
      }
    }
   
    // draw meteor
    for(int j = 0; j < meteorSize; j++) {
      if( ( i-j <NUM_LEDS) && (i-j>=0) ) {
        leds[i-j].setRGB( red, green, blue);
      }
    }
    FastLED.show();
    delay(SpeedDelay);
  }
}

void fadeToBlack(int ledNo, byte fadeValue) {
 #ifdef ADAFRUIT_NEOPIXEL_H
    // NeoPixel
    uint32_t oldColor;
    uint8_t r, g, b;
    int value;
   
    oldColor = strip.getPixelColor(ledNo);
    r = (oldColor & 0x00ff0000UL) >> 16;
    g = (oldColor & 0x0000ff00UL) >> 8;
    b = (oldColor & 0x000000ffUL);

    r=(r<=10)? 0 : (int) r-(r*fadeValue/256);
    g=(g<=10)? 0 : (int) g-(g*fadeValue/256);
    b=(b<=10)? 0 : (int) b-(b*fadeValue/256);
   
    strip.setPixelColor(ledNo, r,g,b);
 #endif
 #ifndef ADAFRUIT_NEOPIXEL_H
   // FastLED
   leds[ledNo].fadeToBlackBy( fadeValue );
 #endif  
}
