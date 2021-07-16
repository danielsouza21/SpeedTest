const ObjectsToCsv = require('objects-to-csv')
const speedTest = require("speedtest-net");

const csvOutputName = "output.csv";
const timefrequencyMin = 30;

Measurement = async () => {
  try {
    console.log("Starting meas...");

    var result = await speedTest({ acceptLicense: true, acceptGdpr: true });

    var download = (result.download.bandwidth / 125000).toFixed(2);
    var upload = (result.upload.bandwidth / 125000).toFixed(2);
    var ping = result.ping.latency.toFixed(2);
    var resultlink = result.result.url;
    var ip = result.server.ip;
    var time = new Date();

    console.log(
      "Results: Download " +
        download +
        " - Upload " +
        upload +
        " - Ping " +
        ping +
        " - Ip " + 
        ip + 
        " | " + 
        time
    );

    var objToSave = [{ time, download, upload, ping, ip, resultlink }];
    const csv = new ObjectsToCsv(objToSave);
    await csv.toDisk("./" + csvOutputName, { append: true });

    console.log("Done meas.");
  } catch (err) {
    console.log(err.message);
  }
};

async function execute() {
  while (true) {
    await Measurement(); 
    await new Promise(resolve => setTimeout(resolve, timefrequencyMin * 60000));
  }
}

execute();
