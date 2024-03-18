import React from 'react';
import { PARAMTYPES, ObjectParameter } from './ObjectParameter.js'

//base CodeObject.  All objects will inherit from this!
export class CodeObject {

  _params = [];  
  _returnType = PARAMTYPES.UNKNOWN;
  _used = 0;
  _name = "";

  constructor(name) {
    this._name = name;
  };

  get name() {
    return this._name;
  };

  getParamsLength = function() {
    return this._params.length;
  };

  getParam = function(index) {
    if ((index >= 0) && (index < this._params.length)) {
      return this._params[index];
    }
    return undefined;
  };

  removeParamObject = function(codeObject) {
    if (codeObject instanceof CodeObject){
      this._params.forEach((param, index) => {
        if (param.getValueObject() === codeObject) {
          this._params[index].clearValue()
        } 
      });
    }
  };


  setParamValue = function(codeObject, position = -1) {
    if (codeObject instanceof CodeObject){
      let updatePosition = -1;
      if ((position >=0) && (position < this._params.length)) {
        updatePosition = position;
      }
      if ( updatePosition < 0) {
        this._params.some((param, index) => {
          if ((!param.hasValue()) && (codeObject.matchesType(param.type))) {
            updatePosition = index;
            return true;
          }
          return false;
        });
      }

      if (updatePosition >= 0) {
        this._params[updatePosition].value = codeObject;
        return true;
      }
    }
    return false;
  };

  matchesType = function(type) {
    return type === this._returnType;
  }

  clearParamValue = function(position = -1) {
    let updatePosition = -1;
    if ((position >=0) && (position < this._params.length)) {
      updatePosition = position;
    }
    if ( updatePosition < 0) {
      for(let index = this._params.length -1; index >= 0; index--){
        if (this._params[index].hasValue()) {
          updatePosition = index;
          break;  
        }
      }   
    }

    if (updatePosition >= 0) {
      let removedObject = this._params[updatePosition].getValueObject();
      this._params[updatePosition].clearValue();
      return removedObject;
    }
    return undefined;
  }

  // this will execute the logic of the code objects
  execute = function(player) {
    return 0;
  }

  canAcceptValue = function (codeObject) {
    if (codeObject instanceof CodeObject) {
      let canAccept = false;
      this._params.forEach( param => {
        if (!param.hasValue() && codeObject.matchesType(param.type)) {
          canAccept = true;
        }
      })
      return canAccept;
    }
    return false;
  }

  //this will create a react object to display
  reactDisplay = function (currentContainerName) {
    // const {attributes, listeners, setNodeRef, transform} = useDraggable({
    //   id: 'unique-id',
    // });

    // const style = {
    //   transform: CSS.Translate.toString(transform),
    // };
    // <div ref={setNodeRef} style={style} {...listeners} {...attributes}>Base CodeObject</div>
    return (
      <div>Base CodeObject</div>
    );
  }

  //this can write it out as a text string 
  toString = function() {
    return "CodeObject"
  }
}
