#!/usr/bin/env python

from dataclasses import dataclass
import json
##########################################################################################################################################################MEASURE UNITS




##########################################################################################################################################################CLASS DEFINITION

def getClass(Item):
  if str(Item.__class__) == "<class 'HMI.Set'>":    ##"<class '__main__.Set'>":
    return "Set"
  elif str(Item.__class__) == "<class 'HMI.Act'>":    ##"<class '__main__.Act'>":
    return "Act"
  elif str(Item.__class__) == "<class 'HMI.SetAct'>":    ##"<class '__main__.SetAct'>":
    return "SetAct"
  elif str(Item.__class__) == "<class 'HMI.LogicSelection'>":    ##"<class '__main__.LogicSelection'>":
    return "LogicSelection"
  elif str(Item.__class__) == "<class 'HMI.LogicButton'>":    ##"<class '__main__.LogicButton'>":
    return "LogicButton"
  elif str(Item.__class__) == "<class 'HMI.LogicVisualization'>":    ##"<class '__main__.LogicVisualization'>":
    return "LogicVisualization"
    
@dataclass     
class Conversion:
  def __init__(self, PIunit, HMIunit, scale, offset, PIDecimals, HMIDecimals):
    self.PIunit = PIunit
    self.HMIunit = HMIunit
    self.scale = scale
    self.offset = offset
    self.HMIDecimals = HMIDecimals
    self.PIDecimals = PIDecimals

  def toHMIUnit(self, val):
    return (val * self.scale) + self.offset

  def toPIUnit(self, val):
    return (val - self.offset) / self.scale
   
class Limits:
  def __init__(self, PIMin, PIMax, HMIMin, HMIMax):
    self.PIMin = PIMin
    self.PIMax = PIMax	
    self.HMIMin = HMIMin
    self.HMIMax = HMIMax
 
class Value:
  def __init__(self, PIVal, HMIVal):
    self.PIVal = PIVal
    self.HMIVal = HMIVal

@dataclass 
class ForceValue:
  def __init__(self, previousValue, forceValue):
    self.previousForce = False
    self.force = False
    self.previousValue = previousValue
    self.forceValue = forceValue

@dataclass
class Display:
  Visible: bool = False
  Enable: bool = False
  Error: bool = False
  Warn: bool = False

LOGIC_MGT_LEN = 8
    
    
##################################################################################################################SET CLASS
	
@dataclass
class Set:
  def __init__(self, Name, conversion, PIMin, PIMax):

    self.Name = Name
    
    self.init = False
    
    self.conversion= conversion
    
    _PiMin = PIMin
    _PiMax = PIMax
    _HMIMin = self.conversion.toHMIUnit(PIMin)
    _HMIMax = self.conversion.toHMIUnit(PIMax)
    self.limits= Limits(_PiMin, _PiMax, _HMIMin, _HMIMax)
    
    _PIVal = 0
    _HMIVal = self.conversion.toHMIUnit(0)
    self.setpoint= Value(_PIVal, _HMIVal)

    _previousValue = 0
    _forceValue = 0
    self.force= ForceValue(_previousValue, _forceValue)
    
    self.lockValue= False
    
    self.display= Display()
    
    self.classe= getClass(self)

    Evaluate(self)

  def WriteSetpoint(self, Value):
    self.setpoint.HMIVal = float(Value)
    return Evaluate(self)

  def toJSON(self):
    strPIformat = "{0:." + str(self.conversion.PIDecimals) + "f}"
    strHMIformat = "{0:." + str(self.conversion.HMIDecimals) + "f}"
    item = {
      'Name': self.Name,
      'init': self.init,
      'conversion': {
        'PIunit': self.conversion.PIunit,
        'HMIunit': self.conversion.HMIunit,
        'scale': str("{0:.6f}".format(self.conversion.scale)),
        'offset': str("{0:.6f}".format(self.conversion.offset)),
        'HMIDecimals': self.conversion.HMIDecimals,
        'PIDecimals': self.conversion.PIDecimals
      },
      'limits': {
        'PIMin': str(strPIformat.format(self.limits.PIMin)),
        'PIMax': str(strPIformat.format(self.limits.PIMax)),
        'HMIMin': str(strHMIformat.format(self.limits.HMIMin)),
        'HMIMax': str(strHMIformat.format(self.limits.HMIMax))
      },
      'setpoint': {
        'PIVal': str(strPIformat.format(self.setpoint.PIVal)),
        'HMIVal': str(strHMIformat.format(self.setpoint.HMIVal))
      },
      'force': {
        'previousForce': self.force.previousForce,
        'force': self.force.force,
        'previousValue': str(strHMIformat.format(self.force.previousValue)),
        'forceValue':str(strPIformat.format(self.force.forceValue))
      },
      'lockValue': self.lockValue,
      'display': self.display.__dict__,
      'classe': self.classe
    }
    
    return json.dumps(item, sort_keys=False, separators=(',',':'))


##################################################################################################################ACT CLASS
    
@dataclass
class Act:
  def __init__(self, Name, conversion, PIMin, PIMax):

    self.Name = Name
    
    self.init = False
    
    self.conversion= conversion
    
    _PiMin = PIMin
    _PiMax = PIMax
    _HMIMin = self.conversion.toHMIUnit(PIMin)
    _HMIMax = self.conversion.toHMIUnit(PIMax)
    self.limits= Limits(_PiMin, _PiMax, _HMIMin, _HMIMax)
    
    _PIVal = 0
    _HMIVal = self.conversion.toHMIUnit(0)
    self.actual= Value(_PIVal, _HMIVal)

    self.display= Display()
    self.classe= getClass(self)

    Evaluate(self)

  def WriteAct(self, Value):
    self.actual.PIVal = float(Value)
    return Evaluate(self)
      
  def toJSON(self):
    strPIformat = "{0:." + str(self.conversion.PIDecimals) + "f}"
    strHMIformat = "{0:." + str(self.conversion.HMIDecimals) + "f}"
    item = {
      'Name': self.Name,
      'conversion': {
        'PIunit': self.conversion.PIunit,
        'HMIunit': self.conversion.HMIunit,
        'scale': str("{0:.6f}".format(self.conversion.scale)),
        'offset': str("{0:.6f}".format(self.conversion.offset)),
        'HMIDecimals': self.conversion.HMIDecimals,
        'PIDecimals': self.conversion.PIDecimals
      },
      'limits': {
        'PIMin': str(strPIformat.format(self.limits.PIMin)),
        'PIMax': str(strPIformat.format(self.limits.PIMax)),
        'HMIMin': str(strHMIformat.format(self.limits.HMIMin)),
        'HMIMax': str(strHMIformat.format(self.limits.HMIMax))
      },
      'actual': {
        'PIVal': str(strPIformat.format(self.actual.PIVal)),
        'HMIVal': str(strHMIformat.format(self.actual.HMIVal))
      },
      'display': self.display.__dict__,
      'classe': self.classe
    }
    
    return json.dumps(item, sort_keys=False, separators=(',',':'))


# ##################################################################################################################SETACT CLASS
    
    
@dataclass
class SetAct:
  def __init__(self, Name, conversion, PIMin, PIMax):

    self.Name = Name
    
    self.init = False
    
    self.conversion= conversion
    
    _PiMin = PIMin
    _PiMax = PIMax
    _HMIMin = self.conversion.toHMIUnit(PIMin)
    _HMIMax = self.conversion.toHMIUnit(PIMax)
    self.limits= Limits(_PiMin, _PiMax, _HMIMin, _HMIMax)
    
    _PIVal = 0
    _HMIVal = self.conversion.toHMIUnit(0)
    self.setpoint= Value(_PIVal, _HMIVal)
    
    _PIVal = 0
    _HMIVal = self.conversion.toHMIUnit(0)
    self.actual= Value(_PIVal, _HMIVal)

    _previousValue = 0
    _forceValue = 0
    self.force= ForceValue(_previousValue, _forceValue)
    
    self.lockValue= False
    
    self.display= Display()
    
    self.classe= getClass(self)

    Evaluate(self)

  def WriteSetpoint(self, Value):
    self.setpoint.HMIVal = float(Value)
    return Evaluate(self)
      
  def WriteAct(self, Value):
    self.actual.PIVal = float(Value)
    return Evaluate(self)

  def toJSON(self):
    strPIformat = "{0:." + str(self.conversion.PIDecimals) + "f}"
    strHMIformat = "{0:." + str(self.conversion.HMIDecimals) + "f}"
    item = {
      'Name': self.Name,
      'init': self.init,
      'conversion': {
        'PIunit': self.conversion.PIunit,
        'HMIunit': self.conversion.HMIunit,
        'scale': str("{0:.6f}".format(self.conversion.scale)),
        'offset': str("{0:.6f}".format(self.conversion.offset)),
        'HMIDecimals': self.conversion.HMIDecimals,
        'PIDecimals': self.conversion.PIDecimals
      },
      'limits': {
        'PIMin': str(strPIformat.format(self.limits.PIMin)),
        'PIMax': str(strPIformat.format(self.limits.PIMax)),
        'HMIMin': str(strHMIformat.format(self.limits.HMIMin)),
        'HMIMax': str(strHMIformat.format(self.limits.HMIMax))
      },
      'setpoint': {
        'PIVal': str(strPIformat.format(self.setpoint.PIVal)),
        'HMIVal': str(strHMIformat.format(self.setpoint.HMIVal))
      },
      'actual': {
        'PIVal': str(strPIformat.format(self.actual.PIVal)),
        'HMIVal': str(strHMIformat.format(self.actual.HMIVal))
      },
      'force': {
        'previousForce': self.force.previousForce,
        'force': self.force.force,
        'previousValue': str(strHMIformat.format(self.force.previousValue)),
        'forceValue':str(strPIformat.format(self.force.forceValue))
      },
      'lockValue': self.lockValue,
      'display': self.display.__dict__,
      'classe': self.classe
    }
    
    return json.dumps(item, sort_keys=False, separators=(',',':'))

##################################################################################################################LOGICSELECTION CLASS

class LogicSelection:
  def __init__(self, Name, Labels):

    self.Name = Name

    self.length = len(Labels)

    self.labels = Labels
    
    self.command = []
    for x in range(self.length):
        self.command.append(False)
    
    self.force = []
    for x in range(self.length):
        self.force.append(False)
    
    self.notAllowed = []
    for x in range(self.length):
        self.notAllowed.append(False)
    
    self.status = []
    for x in range(self.length):
        self.status.append(False)
    self.status[0] = True
        
    self.display= Display()
    
    self.classe= getClass(self)

    Evaluate(self)

  def WriteCommand(self, index, val):
    self.command[index] = val
    return Evaluate(self)

  def toJSON(self):
    item = {
      'Name': self.Name,
      'length': self.length,
      'labels': self.labels,
      'command': self.command,
      'force': self.force,
      'notAllowed': self.notAllowed,
      'status': self.status,
      'display': self.display.__dict__,
      'classe': self.classe
    }
    
    return json.dumps(item, sort_keys=False, separators=(',',':'))
    
##################################################################################################################LOGICBUTTON CLASS

class LogicButton:
  def __init__(self, Name, Labels):

    self.Name = Name

    self.length = len(Labels)

    self.labels = Labels
    
    self.command = []
    for x in range(self.length):
        self.command.append(False)
    
    self.force = []
    for x in range(self.length):
        self.force.append(False)
    
    self.notAllowed = []
    for x in range(self.length):
        self.notAllowed.append(False)
    
    self.status = []
    for x in range(self.length):
        self.status.append(False)
        
    self.display= Display()
    
    self.classe= getClass(self)

    Evaluate(self)

  def WriteCommand(self, index, val):
    self.command[index] = val
    return Evaluate(self)

  def toJSON(self):
    item = {
      'Name': self.Name,
      'length': self.length,
      'labels': self.labels,
      'command': self.command,
      'force': self.force,
      'notAllowed': self.notAllowed,
      'status': self.status,
      'display': self.display.__dict__,
      'classe': self.classe
    }
    
    return json.dumps(item, sort_keys=False, separators=(',',':'))
    
##################################################################################################################LOGICVISUALIZATION CLASS

class LogicVisualization:
  def __init__(self, Name, Labels):

    self.Name = Name

    self.length = len(Labels)
    
    self.labels = Labels
    
    self.force = []
    for x in range(self.length):
      self.force.append(False)
    
    self.status = []
    for x in range(self.length):
      self.status.append(False)
        
    self.display= Display()
    
    self.classe= getClass(self)

    Evaluate(self)

  def toJSON(self):
    item = {
      'Name': self.Name,
      'length': self.length,
      'labels': self.labels,
      'force': self.force,
      'status': self.status,
      'display': self.display.__dict__,
      'classe': self.classe
    }
      
    return json.dumps(item, sort_keys=False, separators=(',',':'))

##########################################################################################################################################################PARSING CONVERSION
    
def parseConv(value):
  return Conversion(value["PIunit"], value["HMIunit"], value["scale"], value["offset"], value["PIDecimals"], value["HMIDecimals"])

##########################################################################################################################################################PARSING VECT
    
def parseVect(key, value, Conv):
  return {
    "Set": ParseSet,
    "Act": ParseAct,
    "SetAct": ParseSetAct,
    "LogicSelection": ParseLogicSelection,
    "LogicButton": ParseLogicButton,
    "LogicVisualization": ParseLogicVisualization
  }.get(value["classe"])(key, value, Conv)

##################################################################################################################SET PARSING

def ParseSet(key, value, Conv):
  return Set(key, Conv[value["conversion"]], value["min"], value["max"])

##################################################################################################################ACT PARSING

def ParseAct(key, value, Conv):
  return Act(key, Conv[value["conversion"]], value["min"], value["max"])

##################################################################################################################SETACT PARSING

def ParseSetAct(key, value, Conv):
  return SetAct(key, Conv[value["conversion"]], value["min"], value["max"])

##################################################################################################################LOGICSELECTION PARSING

def ParseLogicSelection(key, value, Conv):
  return LogicSelection(key, value["labels"])

##################################################################################################################LOGICBUTTON PARSING

def ParseLogicButton(key, value, Conv):
  return LogicButton(key, value["labels"])

##################################################################################################################LOGICVISUALIZATION PARSING

def ParseLogicVisualization(key, value, Conv):
  return LogicVisualization(key, value["labels"])

##########################################################################################################################################################EVALUATION

def Evaluate(Item):
  return {
    "Set": EvaluateSet,
    "Act": EvaluateAct,
    "SetAct": EvaluateSetAct,
    "LogicSelection": EvaluateLogicSelection,
    "LogicButton": EvaluateLogicButton,
    "LogicVisualization": EvaluateLogicVisualization
  }.get(Item.classe)(Item)

##################################################################################################################SET EVALUATION

def EvaluateSet(Item):
  #Check limits value. If max<min put both to 0,10101
  if (Item.limits.PIMin > Item.limits.PIMax):
    Item.limits.PIMin = 0.10101
    Item.limits.PIMax = 0.10101

  #Limits Conversion
  Item.limits.HMIMin = Item.conversion.toHMIUnit(Item.limits.PIMin)
  Item.limits.HMIMax = Item.conversion.toHMIUnit(Item.limits.PIMax)

  #bring the Setpoint back in range
  if (Item.init == False):
    if (Item.limits.PIMin > Item.setpoint.PIVal ):
      Item.setpoint.PIVal = Item.limits.PIMin
      Item.setpoint.HMIVal = Item.limits.HMIMin
    elif (Item.limits.PIMax < Item.setpoint.PIVal ):
      Item.setpoint.PIVal = Item.limits.PIMax
      Item.setpoint.HMIVal = Item.limits.HMIMax
    Item.init = True

  #Checking Lock Setpoint
  if (Item.lockValue):
    Item.setpoint.HMIVal = Item.conversion.toHMIUnit(Item.setpoint.PIVal)

  #Checking Force Setpoint
  if (Item.force.force ):
    if (Item.force.previousForce == False):
      Item.force.previousValue = Item.setpoint.HMIVal
      Item.force.previousForce = True
    Item.setpoint.HMIVal = Item.conversion.toHMIUnit(Item.force.forceValue)
  elif (Item.force.previousForce == True):
    Item.setpoint.HMIVal = Item.force.previousValue
    Item.force.previousForce == False

  #Checking Setpoint limits
  if (Item.limits.HMIMin > Item.setpoint.HMIVal ):
    Item.setpoint.HMIVal = Item.conversion.toHMIUnit(Item.setpoint.PIVal)
  elif (Item.limits.HMIMax < Item.setpoint.HMIVal ):
    Item.setpoint.HMIVal = Item.conversion.toHMIUnit(Item.setpoint.PIVal)
  else:
    Item.setpoint.PIVal = Item.conversion.toPIUnit(Item.setpoint.HMIVal)
  return Item.toJSON()
##################################################################################################################ACT EVALUATION
        
def EvaluateAct(Item):
  #Check limits value. If max<min put both to 0,10101
  if (Item.limits.PIMin > Item.limits.PIMax):
    Item.limits.PIMin = 0.10101
    Item.limits.PIMax = 0.10101

  #Limits Conversion
  Item.limits.HMIMin = Item.conversion.toHMIUnit(Item.limits.PIMin)
  Item.limits.HMIMax = Item.conversion.toHMIUnit(Item.limits.PIMax)

  #Converting Actual
  Item.actual.HMIVal = Item.conversion.toHMIUnit(Item.actual.PIVal)
  return Item.toJSON()

##################################################################################################################SETACT EVALUATION
    
def EvaluateSetAct(Item):
  #Check limits value. If max<min put both to 0,10101
  if (Item.limits.PIMin > Item.limits.PIMax):
    Item.limits.PIMin = 0.10101
    Item.limits.PIMax = 0.10101

  #Limits Conversion
  Item.limits.HMIMin = Item.conversion.toHMIUnit(Item.limits.PIMin)
  Item.limits.HMIMax = Item.conversion.toHMIUnit(Item.limits.PIMax)
  
  #bring the Setpoint back in range
  if (Item.init == False):
    if (Item.limits.PIMin > Item.setpoint.PIVal ):
      Item.setpoint.PIVal = Item.limits.PIMin
      Item.setpoint.HMIVal = Item.limits.HMIMin
    elif (Item.limits.PIMax < Item.setpoint.PIVal ):
      Item.setpoint.PIVal = Item.limits.PIMax
      Item.setpoint.HMIVal = Item.limits.HMIMax
    Item.init = True
  
  #Checking Lock Setpoint
  if (Item.lockValue):
    Item.setpoint.HMIVal = Item.conversion.toHMIUnit(Item.setpoint.PIVal)

  #Checking Force Setpoint
  if (Item.force.force ):
    if (Item.force.previousForce == False):
      Item.force.previousValue = Item.setpoint.HMIVal
      Item.force.previousForce = True
    Item.setpoint.HMIVal = Item.conversion.toHMIUnit(Item.force.forceValue)
  elif (Item.force.previousForce == True):
    Item.setpoint.HMIVal = Item.force.previousValue
    Item.force.previousForce == False

  #Checking Setpoint limits
  if (Item.limits.HMIMin > Item.setpoint.HMIVal ):
    Item.setpoint.HMIVal = Item.conversion.toHMIUnit(Item.setpoint.PIVal)
  elif (Item.limits.HMIMax < Item.setpoint.HMIVal ):
    Item.setpoint.HMIVal = Item.conversion.toHMIUnit(Item.setpoint.PIVal)
  else:
    Item.setpoint.PIVal = Item.conversion.toPIUnit(Item.setpoint.HMIVal)

  #Converting Actual
  Item.actual.HMIVal = Item.conversion.toHMIUnit(Item.actual.PIVal)
  return Item.toJSON()

##################################################################################################################LOGICSELECTION EVALUATION

def EvaluateLogicSelection(Item):
  #Logic selection management, with not allowed condition
  for x in reversed(range(Item.length)):
    if (Item.command[x] and not Item.notAllowed[x]):
      for y in reversed(range(Item.length)):
        Item.status[y] = False
      Item.status[x] = True

  #force management
  for x in reversed(range(Item.length)):
    if Item.force[x]:
      for y in reversed(range(Item.length)):
        Item.status[y] = False
      Item.status[x] = True

  #reset command        
  for x in reversed(range(Item.length)):
    Item.command[x] = False
      
  return Item.toJSON()
        
##################################################################################################################LOGICBUTTON EVALUATION

def EvaluateLogicButton(Item):
  #Logic button management, with not allowed condition
  for x in reversed(range(Item.length)):
    if (Item.command[x] and not Item.notAllowed[x]):
      Item.status[x] = True
    else:
      Item.status[x] = False

  #force management
  for x in reversed(range(Item.length)):
    if Item.force[x]:
      for y in reversed(range(Item.length)):
        Item.status[y] = False
      Item.status[x] = True

  return Item.toJSON()

##################################################################################################################LOGICVISUALIZATION EVALUATION

def EvaluateLogicVisualization(Item):
  #force management
  for x in reversed(range(Item.length)):
      if Item.force[x]:
          Item.status[x] = True