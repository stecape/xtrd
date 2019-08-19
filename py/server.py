#!/usr/bin/env python

import os
from flask import Flask, request
from flask_cors import CORS, cross_origin
import json

from HMI import * #Conversion, Evaluate, Set, LogicSelection, LogicButton, LogicVisualization #Act, SetAct


with open('py/json/Conv.json') as config_file:
    data = json.load(config_file)

Conv = {}

for key in data:
  Conv[key] = parseConv(data[key])


with open('py/json/Vect.json') as config_file:
    data = json.load(config_file)

Vect = {}

for key in data:
  Vect[key] = parseVect(key, data[key], Conv)

for Item in Vect:
   Evaluate(Vect[Item])


def returnJSON (item):
	return Vect[item].toJSON()




app = Flask(__name__)
CORS(app, resources=r'/*')
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['CORS_METHOD'] = 'POST'


@app.route("/getData")
@cross_origin()
def getData():
	for Item in Vect:
   		Evaluate(Vect[Item])
	VectStr = list(map(returnJSON, Vect))
	return str(VectStr)


@app.route("/set", methods=['POST', 'GET'])
@cross_origin()
def set():
  req = request.get_json()
  return Vect[req['tag']].WriteSetpoint(req['val'])

@app.route("/logicSelection", methods=['POST', 'GET'])
@cross_origin()
def logicSelection():
  req = request.get_json()
  return Vect[req['tag']].WriteCommand(req['index'], req['val'])

@app.route("/logicButton", methods=['POST', 'GET'])
@cross_origin()
def logicButton():
  req = request.get_json()
  return Vect[req['tag']].WriteCommand(req['index'], req['val'])



if __name__ == "__main__":
    app.run(host='localhost', port=os.environ.get('PORT', 3002), debug=True)