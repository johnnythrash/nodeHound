import ping from "ping";
import * as fs from "fs";
import { services } from "./config.js";

/*	1.	ping_host(host: str) -> bool
Ping a host and return True if it’s up, False otherwise.*/

async function pingHost(host) {
  let res = await ping.promise.probe(host);
  console.log(res);
  return res.alive;
}

// 2.	log_status(service_name: str, is_up: bool)
// Append a simple timestamped line to a log file like home_assistant_status.log.
const logStatus = (serviceName, isUp) => {
  const path = `./logs/${serviceName}.log`;
  const currentTime = new Date();
  const data = `[${currentTime}] is up? ${isUp} \n`;
  fs.mkdirSync("./logs", { recursive: true });
  fs.appendFileSync(path, data, "utf8");
};

// 	3.	monitor_services()
// Loop over a list of services (host + name) every X seconds, call ping_host and log_status for each.
async function monitorServices() {
  const promises = services.map(async (s) => {
    const isUp = await pingHost(s.host);
    logStatus(s.name, isUp);
  });

  await Promise.all(promises);
}

// 	4.	start_monitor()
// Entry point that kicks off monitor_services() on repeat (or runs once, if you’re testing).

function startMonitor() {
  setInterval(monitorServices, 2000);
}

startMonitor();
