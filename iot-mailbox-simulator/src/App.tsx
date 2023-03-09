import React, { useEffect, useState } from "react";
import "./App.css";

class IOTMailbox {
  signalInterval: number = 500;
  intervalID: number | null = null;
  lastLightLevel: number = 0;
  signalCallback: (lightLevel: number) => void;

  constructor(signalInterval: number, signalCallback: (lightLevel: number) => void) {
    this.signalInterval = signalInterval;
    this.signalCallback = signalCallback;
    this.intervalID = null;
    this.lastLightLevel = 0;
  }

  startMonitoring = () => {
    console.log(`Starting monitoring of mailbox...`);
    this.intervalID = window.setInterval(this.signalStateChange, this.signalInterval);
  };

  stopMonitoring = () => {
    if (this.intervalID === null) return;
    window.clearInterval(this.intervalID);
    this.intervalID = null;
    console.log(`Mailbox monitoring stopped...`);
  };

  signalStateChange = () => {
    let random: number = Number(Math.random().toFixed(2));
    const lightLevel = this.lastLightLevel >= 0 ? random * -1 : random;
    console.log(`Mailbox state changed - lightLevel: ${lightLevel}`);
    this.signalCallback(lightLevel);
    this.lastLightLevel = lightLevel;
  };
}

const App: React.FC = () => {
  const [log, setLog] = useState<Array<string>>([]);
  const [notifications, setNotifications] = useState<Array<string>>([]);
  const signalInterval = 500;
  const [iotMailbox, setIotMailbox] = useState<IOTMailbox>();
  const [monitoringStatus, setMonitoringStatus] = useState(false);

  useEffect(() => {
    setIotMailbox(new IOTMailbox(signalInterval, signalCallback));
  }, []);

  function startMonitoring() {
    iotMailbox!.startMonitoring();
    logHandler(`監視を開始しました`);
    setMonitoringStatus(true);
  }

  function stopMonitoring() {
    iotMailbox!.stopMonitoring();
    logHandler(`監視を停止しました`);
    setMonitoringStatus(false);
  }

  function reset() {
    if (monitoringStatus) {
      stopMonitoring();
    }
    setLog([]);
    setNotifications([]);
  }

  function signalCallback(lightLevel: number) {
    if (lightLevel > 0) {
      let message = notifications;
      message.push("受信ボックスが開きました");
      setNotifications(message);
      logHandler(`【光量: ${lightLevel}】　現在受信ボックスは開いています`);
    } else {
      logHandler(`【光量: ${lightLevel}】　現在受信ボックスは閉じています`);
    }
  }

  function logHandler(message: string) {
    setLog((log) => {
      let logMessages = [...log];

      logMessages.push(message);

      return logMessages;
    });
  }
  return (
    <>
      <button onClick={() => startMonitoring()}>Start Monitoring</button>
      <button onClick={() => stopMonitoring()}>Stop Monitoring</button>
      <button onClick={() => reset()}>Reset</button>

      <div>
        <p>通知パネル</p>
        <div
          style={{
            width: "200px",
            height: "200px",
            border: "1px solid #000",
            overflowY: "scroll",
          }}
        >
          {notifications.map((notificationMessage, index) => (
            <p>{notificationMessage}</p>
          ))}
        </div>
      </div>

      <div>
        <p>ログパネル</p>
        <div
          style={{
            width: "200px",
            height: "200px",
            border: "1px solid #000",
            overflowY: "scroll",
          }}
        >
          {log.map((log, index) => (
            <p>{log}</p>
          ))}
        </div>
      </div>
    </>
  );
};

export default App;
