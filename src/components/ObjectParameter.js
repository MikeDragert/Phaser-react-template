import { CodeObject } from "./CodeObject";

// All possible code object types.
export const PARAMTYPES = {
  UNKNOWN: "Unknown",  //not exactly a valid type, but used in the base Class
  NUMBER: "Number",
  STRING: "String",
  BOOLEAN: "Boolean",
  ARRAY: "Array",
  NONE: "None"
}

export class ObjectParameter {
  _name = "name"
  _type = undefined;
  _defaultValue = undefined;
  _value = undefined;
  
  constructor(name, type, defaultValue) {
    this._name = name;
    this._type = type;
    this._defaultValue = defaultValue;
  };

  get name() {
    return this._name;
  }

  get value() {
    if (this._value) {
      if (this._value instanceof CodeObject) {
        return this._value.execute();
      } else {
        return this._value;
      }
    } 
    return this._defaultValue;
  }

  get type() {
    return this._type;
  }

  set value(value) {
    this._value = value;
  }

  isCodeObject = function() {
    return (this._value instanceof CodeObject);
  }

  clearValue = function() {
    this._value = undefined;
  }

  getValueObject = function() {
    return this._value;
  }

  hasValue = function() {
    return this._value !== undefined;
  }

  reactDisplay = function(currentContainerName) {
    if (this.isCodeObject()) {
      return (this._value.reactDisplay(currentContainerName))
    }

    if (this._value === undefined)  {
      return (this._defaultValue)
    }
    return (this._params[0].value)
    
  }
}