import paho.mqtt.client as mqtt
import json
import time
import pandas as pd

THINGSBOARD_HOST = '3.111.205.170'

def on_connect(client, userdata, flags, rc):
    print(f"Connected with result code {rc}")

def send_telemetry_data(access_token, csv_file_path):
    try:
        data = pd.read_csv(csv_file_path)
    except Exception as e:
        print(f"Error reading CSV file: {e}")
        return

    client = mqtt.Client()
    client.username_pw_set(access_token)
    client.on_connect = on_connect
        
    client.connect(THINGSBOARD_HOST, 1883, 60)
    client.loop_start()

    try:
        for index, row in data.iterrows():
            telemetry_data = {}
            for column in data.columns:
                telemetry_data[column] = round(row[column], 3)
            
            client.publish('v1/devices/me/telemetry', json.dumps(telemetry_data))
            print(f"Sent telemetry data: {telemetry_data}")

            time.sleep(5)  
    except Exception as e:
        print(f"Error while sending telemetry: {e}")
    finally:
        client.loop_stop()

if __name__ == "__main__":
    try:
        send_telemetry_data("nDdu1s4zFvWJCmTf0BlU", 'your_data.csv')
    except KeyboardInterrupt:
        print("Disconnected by user")
