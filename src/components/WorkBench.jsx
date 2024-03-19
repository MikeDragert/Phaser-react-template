import React from 'react';
import { DndContext } from '@dnd-kit/core';

import '../styles/WorkBench.css'

import { PARAMTYPES, ObjectParameter } from './ObjectParameter.js'
import { CodeObject } from './CodeObject.jsx'
import { CodeFunction } from './CodeFunction.jsx'
import { Operator} from './Operator.jsx'
import { CodeNumber } from './CodeNumber.jsx'
import Droppable from './Droppable.jsx'
import Draggable from './Draggable.jsx'

// and by building the objects together to create behaviour for a key
class WorkBench extends React.Component {
  constructor(codeList, moveCodeObject, changeMaxCurrency, loaded, setLoaded, functionList) {
    super();
    this.codeList = codeList;
    this.baseMoveCodeObject = moveCodeObject;  
    this.changeMaxCurrency = changeMaxCurrency;   
    this.loaded = loaded;
    this.setLoaded = setLoaded;
    
    if (!this.loaded) {
      //for testing, lets set a max currency
      this.changeMaxCurrency(10);
      //for a test, let's set up some params!
      let plusOperator = new Operator('plusOp', '+');
      let minusOperator = new Operator('minusOp', '-');
      let multiplyOperator = new Operator('multiplyOp', '*');
      let divideOperator = new Operator('divideOp', '/');
      let modulusOperator = new Operator('modulusOp', '%');

      let number1 = new CodeNumber('num1', 1);
      let number2 = new CodeNumber('num2', 2);
      let number3 = new CodeNumber('num3', 3);
      let number4 = new CodeNumber('num4', 4);
      let number5 = new CodeNumber('num5', 5);
      let number6 = new CodeNumber('num6', 6);
      let number7 = new CodeNumber('num7', 7);
      let number8 = new CodeNumber('num8', 8);
      let number9 = new CodeNumber('num9', 9);
      let number10 = new CodeNumber('num10', 10);


      this.addCodeObjectToBench(plusOperator);
      this.addCodeObjectToBench(minusOperator);
      this.addCodeObjectToBench(multiplyOperator);
      this.addCodeObjectToBench(divideOperator);
      this.addCodeObjectToBench(modulusOperator);
      this.addCodeObjectToBench(number1);
      this.addCodeObjectToBench(number2);
      this.addCodeObjectToBench(number3);
      this.addCodeObjectToBench(number4);
      this.addCodeObjectToBench(number5);
      this.addCodeObjectToBench(number6);
      this.addCodeObjectToBench(number7);
      this.addCodeObjectToBench(number8);
      this.addCodeObjectToBench(number9);
      this.addCodeObjectToBench(number10);

      let newNumber = number10.clone('-CLONE')
      console.log('cloned', number10,newNumber)

      functionList.forEach(codeFunction => {
        this.createFunction(codeFunction.name, codeFunction.callback, []);
      });
      
      //this.codeList = this.updateCodeList({... this.codeList, loaded: true})
      setLoaded = this.setLoaded(true);
    }

  }

  moveCodeObject = function(codeObject, fromName, toName) {
    this.baseMoveCodeObject(codeObject, fromName, toName);
  }

  execute1 = function() {
    this.codeList.keys[1].forEach(codeItem => {
      codeItem.execute()
    })
  }

  logMyCodeList = function() {
    console.log('My current codeList is', this.codeList)
  }

  createFunction = function(name, callback, params) {
    let codeFunction = new CodeFunction(name, callback)
    if (params) {
      params.forEach((param, index) => codeFunction.setParamValue(param, index+1));
    }
    this.addCodeObjectToBench(codeFunction)
  }

  setCodeList = function (newCodeList) {
    this.codeList = {...newCodeList};
    this.logMyCodeList()
  }

  addCodeObjectToBench = function(codeObject) {
    if (codeObject instanceof CodeObject) {
      this.moveCodeObject(codeObject, undefined, 'bench')
    }
  }

  handleDragEnd = function(event) {
    if (event) {
      const {active, over} = event;
      if (active && over) {
        //console.log('Move',active.data.current.this, 'From', active.data.current.currentContainerName, 'To', over.data.current.id, 'codelist:', this.codeList)
        this.moveCodeObject(active.data.current.this, active.data.current.currentContainerName, over.data.current.id)
      }
    }
  }

  //todo: need unique key
  getReactBench = function() {   
    return (
      <>
        <div><label>Currency:</label><span>{this.codeList.currentCurrency}</span></div>
        <DndContext onDragEnd={(event) => this.handleDragEnd(event)}>
          <div className='benchContainer'>
            <Droppable id="key1" className="workbench workbench-left">
              {this.codeList.keys[1].map(codeObject => {
                return codeObject.reactDisplay("key1")
              })}
            </Droppable>
            <Droppable id="bench" className="workbench workbench-right">
              {this.codeList.keys[0].map(codeObject => {
                return codeObject.reactDisplay("bench")
              })}
            </Droppable>
          </div>
        </DndContext>
      </>
    )
  }
} 

export default WorkBench;
