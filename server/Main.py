from P10 import *
from ErgastAPI import *
import json 
import csv
import sys
import os


def save_prediction(userprediction):
    racenumber, _ = get_current_race()
   
    user_prediction = json.loads(userprediction)
    league = user_prediction["league"]
    username = user_prediction["username"]
    p10 = user_prediction["p10"]
    dnf = user_prediction["dnf"]

    # Check if league folder exists
    if not os.path.isdir('data/' +league+'/'):
        print({"error": "league" })
        return

    # Check if username exists
    if not os.path.exists('data/' +league + "/" + username + ".csv"):
        print({"error": "username" })
        return

    filename = 'data/' +league + "/" + username + ".csv"
    file = open(filename, "r")
    data = list(csv.reader(file, delimiter=","))
    file.close()

    if len(data) > 1 and data[-1][0] == str(racenumber): 
        data [-1] = [racenumber, p10, dnf]
        writemode = "w"
        with open(filename, writemode) as file:
            writer = csv.writer(file,lineterminator="\n")
            for e in data:
                writer.writerow(e)
    else: 
        writemode = "at"
        data = [racenumber, p10, dnf]
        with open(filename, writemode) as file:
            writer = csv.writer(file,lineterminator="\n")
            writer.writerow(data)
    print({"racenumber":racenumber, "p10":p10, "dnf":dnf, "league":league, "username":username})


def get_current_race():
    f = open("data/deadlines.json")
    data = json.load(f)
    f.close()

    for racenumber, race_deadline in data.items():
        if race_deadline > time.time():
            return racenumber, race_deadline
        
def get_race_name(racenumber):
    f = open("data/racenames.json")
    data = json.load(f)
    f.close()
    return data[racenumber]


def get_history(user_inputs):

    league = user_inputs["league"]
    username = user_inputs["username"]

    # Check if league folder exists
    if not os.path.isdir('data/' +league+'/'):
        print([{"error": "league" }])
        return

    file_path = 'data/' +league + "/" + username + ".csv"
    # Check if username exists
    if not os.path.exists(file_path):
        print([{"error": "username" }])
        return
    
    data = []
    # Read in csv file and reformat to json 
    with open(file_path, newline='\n') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            data.append(row)
    data.reverse()

    return json.dumps(data)




target_func = sys.argv[1]

if target_func == 'get_current_race':
    race_number,race_deadline = get_current_race()
    race_name = get_race_name(race_number)
    res_data = {'race_number':race_number, 'race_deadline':race_deadline, 'race_name': race_name} 
    print(json.dumps(res_data))
elif target_func == 'save_prediction':
    arg = sys.argv[2]
    save_prediction(arg)
elif target_func == 'get_history':
    args = sys.argv[2]
    print(get_history(json.loads(args)))



