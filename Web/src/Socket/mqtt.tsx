import mqtt from 'mqtt';

const url = "ws://192.168.117.37:9001";
const options = { username: "loza", password: "loza" };
const client = mqtt.connect(url, options);

export default function MqttConnection({ topics }: { topics: string[] }) {

    client.on("connect", () => {
        console.log("Mqtt Socket connection success.");
        if (topics.length > 0) {
            client.subscribe(topics, (err) => {
                if (!err) {
                    console.log("Mqtt subscribed to topics successfully.");
                } else {
                    console.log("Failed to subscribe to topics.");
                }
            });
        }
    });

    client.on("error", (err) => {
        console.error("MQTT connection error:", err);
    });

    return () => {
        client.end();
    };
    
}

export const publish = (topic: string, message: string) => {
    client.publish(topic, message, (err) => {
        if (err) {
            console.error("Error publishing message:", err);
        } else {
            console.log("Message published successfully.");
        }
    });
}