import ergast_py
from P10 import * 
import json
import time

def get_results(round, season):
    e = ergast_py.Ergast()
    race = e.season(season).round(round).get_result()
    results = [] 
    for driver_result in race.results:
        r = Raceresult(driver_result.position, driver_result.position_text, driver_result.laps, driver_result.driver.driver_id)
        results.append(r)
    return results

def get_schedule(racename, racenumber):
    #todo get real race schedule from somewhere
    return



#Wilmer = Player("WilmerKarl", 100, 1)
#Wilmer.set_prediction(Prediction("hamilton", "leo", 1))
#Resultat = get_results(4,2023)
#print(Wilmer.p10calcscore(Resultat))
#print(Wilmer.dnfcalcscore(Resultat))


#print(get_results(4,2023))

