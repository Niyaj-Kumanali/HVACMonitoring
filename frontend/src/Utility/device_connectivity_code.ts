export const connectivityCode = (
    wifi_username: string,
    wifi_password: string,
    deviceToken: string
) => {
    return `
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include "DHT.h"

// WiFi credentials
const char* ssid = "${wifi_username}";        
const char* password = "${wifi_password}";    

// ThingsBoard MQTT server
const char* mqtt_server_tb = "hvac.myoorja.in";

// Authentication token for ThingsBoard
const char* tb_token = "${deviceToken}";

// DHT sensor settings
#define DHTTYPE DHT11 
#define DHTPIN 4      

DHT dht(DHTPIN, DHTTYPE);

// Timing constants
const unsigned long publish_interval = 10 * 1000UL;  // 10 seconds
unsigned long last_publish_time = 0;

WiFiClient espClient;
PubSubClient tbClient(espClient);

void setup() {
  Serial.begin(115200);
  dht.begin();
  setup_wifi();
  setup_mqtt_client();
}

void loop() {
  if (!tbClient.connected()) {
    reconnect_tb();
  }
  tbClient.loop();

  unsigned long current_time = millis();
  if (current_time - last_publish_time >= publish_interval) {
    publish_sensor_data();
    last_publish_time = current_time;
  }
}

void setup_wifi() {
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\\nWiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void setup_mqtt_client() {
  tbClient.setServer(mqtt_server_tb, 1883);
}

void reconnect_tb() {
  while (!tbClient.connected()) {
    Serial.print("Connecting to ThingsBoard MQTT broker...");
    String clientId = "ESP32Client-" + String(random(0xffff), HEX);
    if (tbClient.connect(clientId.c_str(), tb_token, "")) {
      Serial.println("Connected to ThingsBoard MQTT broker");
    } else {
      Serial.print("failed, rc=");
      Serial.print(tbClient.state());
      Serial.println(" retrying in 5 seconds");
      delay(5000);
    }
  }
}

void publish_sensor_data() {
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();

  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  DynamicJsonDocument telemetry(1023);
  telemetry["temperature"] = temperature;
  telemetry["humidity"] = humidity;

  String payload;
  serializeJson(telemetry, payload);

  // Publish to ThingsBoard
  String tb_topic = "v1/devices/me/telemetry";
  tbClient.publish(tb_topic.c_str(), payload.c_str());
  Serial.println("Published to ThingsBoard on topic: " + tb_topic);
  Serial.println("Payload: " + payload);
}
`;
};
