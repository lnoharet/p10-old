var fs = require('fs');

const express = require("express");
const cors = require("cors");
const {spawn} = require("child_process");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors());
app.use(express.json());

fake_data = 
  [
    {"rank": 1, "p10_points": 250, "dnf_points": 10, "total_points": 240, "name": "PlayerA", "trend": "+3"},
    {"rank": 2, "p10_points": 230, "dnf_points": 15, "total_points": 215, "name": "PlayerB", "trend": "-2"},
    {"rank": 3, "p10_points": 220, "dnf_points": 12, "total_points": 208, "name": "PlayerC", "trend": "+1"},
    {"rank": 4, "p10_points": 210, "dnf_points": 8, "total_points": 202, "name": "PlayerD", "trend": "-3"},
    {"rank": 5, "p10_points": 200, "dnf_points": 18, "total_points": 182, "name": "PlayerE", "trend": "+2"},
    {"rank": 6, "p10_points": 190, "dnf_points": 14, "total_points": 176, "name": "PlayerF", "trend": "-4"},
    {"rank": 7, "p10_points": 180, "dnf_points": 20, "total_points": 160, "name": "PlayerG", "trend": "+5"},
    {"rank": 8, "p10_points": 170, "dnf_points": 9, "total_points": 161, "name": "PlayerH", "trend": "-1"},
    {"rank": 9, "p10_points": 160, "dnf_points": 22, "total_points": 138, "name": "PlayerI", "trend": "+4"},
    {"rank": 10, "p10_points": 150, "dnf_points": 17, "total_points": 133, "name": "PlayerJ", "trend": "-5"},
    {"rank": 11, "p10_points": 140, "dnf_points": 11, "total_points": 129, "name": "PlayerK", "trend": "+2"},
    {"rank": 12, "p10_points": 130, "dnf_points": 13, "total_points": 117, "name": "PlayerL", "trend": "-3"},
    {"rank": 13, "p10_points": 120, "dnf_points": 16, "total_points": 104, "name": "PlayerM", "trend": "+1"},
    {"rank": 14, "p10_points": 110, "dnf_points": 7, "total_points": 103, "name": "PlayerN", "trend": "-4"},
    {"rank": 15, "p10_points": 100, "dnf_points": 25, "total_points": 75, "name": "PlayerO", "trend": "+5"},
    {"rank": 16, "p10_points": 90, "dnf_points": 19, "total_points": 71, "name": "PlayerP", "trend": "-1"},
    {"rank": 17, "p10_points": 80, "dnf_points": 23, "total_points": 57, "name": "PlayerQ", "trend": "+4"},
    {"rank": 18, "p10_points": 70, "dnf_points": 6, "total_points": 64, "name": "PlayerR", "trend": "-2"},
    {"rank": 19, "p10_points": 60, "dnf_points": 21, "total_points": 39, "name": "PlayerS", "trend": "+3"},
    {"rank": 20, "p10_points": 50, "dnf_points": 24, "total_points": 26, "name": "PlayerT", "trend": "-5"}
]

fake_history = [
  {
    "race_number": 1,
    "p10_pred": "Lewis Hamilton",
    "dnf_pred": "Sebastian Vettel",
    "race_name": "Grand Prix of City A"
  }]


// Add Access Control Allow Origin headers
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});


app.get("/api", (req, res) => {
    res.json({ message: "GET Hello from server!" });
});

app.get("/api/next_deadline", (req, res) => {
  // request for next deadline 

  // Get current race from deadlines file
  var current_race_process = spawn('python3',['server/Main.py', 'get_current_race']);

  current_race_process.stdout.on('data', function(data) { 
    console.log('done with python get_current_race script');
    console.log(data.toString());
    res.json(data.toString());
  });
  
  current_race_process.stderr.on('data', (data) => {
    // Send a response back to the client
    res.json({ response: "Error"});
    console.error(`Error from Python get_current_race script: ${data}`);

  });
  
  // Handle process exit event
  current_race_process.on('close', (code) => {
    console.log(`Python get_current_race script exited with code ${code}`);
  });

});


app.get("/api/drivers", (req, res) => {
  // Got request to fetch latest drivers from last available session
  const drivers = {}

  res.json({ message: "GET drivers from server!", data: drivers});
});


app.post("/api/league", (req, res) => {
    // Access the data sent in the request body
    
    const requestData = req.body;
    console.log("Got this request:", requestData)

    // Send a response back to the client
    res.json({ message: "POST Hello from server!", data: fake_data});
});


app.post("/api/prediction", (req, res) => {
  // Access the data sent in the request body
  const requestData = req.body;
  console.log("Got this request:", requestData)

  var process = spawn('python3',['server/Main.py', 'save_prediction', JSON.stringify(requestData)]);

  process.stdout.on('data', function(data) { 
    console.log('done with python script');
    // Send a response back to the client
    const buffer = Buffer.from(data);
    const resultString = buffer.toString().replace(/'/g, '"');
    const res_json = JSON.parse(resultString);
    if (res_json.hasOwnProperty('error')){
      // Some error occured, send back to client to let them know cause
      res.json({response: "Err", data: res_json['error']})
    }
    else{
      res.json({ response: "OK", data: resultString});
    }
  });
  
  process.stderr.on('data', (data) => {
    // Send a response back to the client
    res.json({ response: "Error"});
    console.log(`Error from Python script: ${data}`);

  });
  
  // Handle process exit event
  process.on('close', (code) => {
    console.log(`Python script exited with code ${code}`);
  });
});


app.post("/api/predHistory", (req, res) => {
  // Access the data sent in the request body
  const requestData = req.body;
  console.log("Got this request:", requestData)


  var hist_process = spawn('python3',['server/Main.py', 'get_history', JSON.stringify(requestData)]);
  
  // TODO: OUTPUT FRÅN PYTHON FUNKAR EJ!!!!

  hist_process.stdout.on('data', function(data) { 
    console.log('done with python script');
    // Send a response back to the client
    const buffer = Buffer.from(data);

    const resultString = buffer.toString().replace(/'/g, '"');
    console.log(resultString)

    const res_json = JSON.parse(resultString);

    console.log(res_json)
    
    if (res_json[0].hasOwnProperty('error')){
      console.log('EEEEE')

      // Some error occured, send back to client to let them know cause
      res.json({response: "Err", data: JSON.stringify(res_json)});
    }
    else{
      console.log('AAAA')

      res.json({ response: "OK", data: res_json});
    }
  });

  
  hist_process.stderr.on('data', (data) => {
    // Send a response back to the client
    res.json({ response: "Error"});
    console.log(`Error from Python script: ${data}`);

  });
  
  // Handle process exit event
  hist_process.on('close', (code) => {
    console.log(`Python script exited with code ${code}`);
  });
  
});


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});


