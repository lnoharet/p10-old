class Player:
    def __init__(self, username, points, rank):
        self.username = username
        self.points = points
        self.rank = rank
        self.prediction = None
    def addpoints(self, newpoints):
        self.points = self.points + newpoints
    def p10calcscore(self, raceresult):
        p10prediction = self.prediction.p10prediction
        driverpos=[o.driver_id for o in raceresult]
        pred_position = driverpos.index(p10prediction) + 1
        points_list = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1, 0]
        return points_list[abs(10 - pred_position)]
    def dnfcalcscore(self, raceresult):
        dnfprediction = self.prediction.dnfprediction
        minposition = 0
        firstdnf = ""
        for driver in raceresult:
            if driver.position_text == "R":
                if driver.position > minposition:
                    minposition = driver.position
                    firstdnf = driver.driver_id
        if dnfprediction == firstdnf:
            return 10
        else: return 0 
    def set_prediction(self, prediction):
        self.prediction = prediction

class League:
    def __init__(self, leaguename, players):
        self.leaguename = leaguename
        self.players = players
    def ranking(self):
        self.players = sorted(self.players, key=lambda x: x.points, reverse=True)


class Prediction:
    def __init__(self, p10prediction, dnfprediction, racenumber):
        self.p10prediction = p10prediction
        self.dnfprediction = dnfprediction
        self.racenumber = racenumber

class Raceresult:
    def __init__(self, position, position_text, laps, driver_id):
        self.position = position
        self.position_text = position_text
        self.laps = laps
        self.driver_id = driver_id

"""

Leo = Player("LeoNoha", 99, 2)
Paul = Player("PaulMan", 1, 3)

Liga = League("Jannes Viltvaktare", [Paul, Leo])
print(Liga.players)

for i in Liga.players: 
    i.addpoints(newpoints = 12)
    print(i.points, i.username, i.rank)

Liga.ranking()
for i in Liga.players:
    print(i.points, i.username)


Raceresluts = ["Norris", "Alonso", "Sainz", "Leclec", "Hamilton", "Verstappen", "Perez", "Piastri", "Stroll", "Albon", "Sergant", "Magnussen", "Hulkenberg", "Russel", "Bottas", "Zhou", "Gasly", "Ocon", "Tsunoda", "Ricciardo"]

Pred = Prediction("Hamilton", "Sergant", 1)

"""
