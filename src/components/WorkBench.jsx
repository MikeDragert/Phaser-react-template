import React from 'react';
import { DndContext } from '@dnd-kit/core';

import '../styles/WorkBench.css'

import { PARAMTYPES, ObjectParameter } from './ObjectParameter.js'
import { CodeObject } from './CodeObject.jsx'
import { CodeFunction } from './CodeFunction.jsx'
import { Operator} from './Operator.jsx'
import { Number } from './Number.jsx'
import Droppable from './Droppable.jsx'
import Draggable from './Draggable.jsx'

// and by building the objects together to create behaviour for a key
class WorkBench extends React.Component {
  constructor(codeList, moveCodeObject, loaded, setLoaded, functionList){
    super();
    this.codeList = codeList;
    this.moveCodeObject = moveCodeObject;    
    this.loaded = loaded;
    this.setLoaded = setLoaded;
    
    if (!this.loaded) {
      //for a test, let's set up some params!
      let plusOperator = new Operator('plusOp');

      let number1 = new Number('num1');
      let number2 = new Number('num2');
      number1.setParamValue(200);
      number2.setParamValue(300);

      this.addCodeObjectToBench(plusOperator);
      this.addCodeObjectToBench(number1);
      this.addCodeObjectToBench(number2);

      functionList.forEach(codeFunction => {
        this.createFunction(codeFunction.name, codeFunction.callback, []);
      });
      
      //this.codeList = this.updateCodeList({... this.codeList, loaded: true})
      setLoaded = this.setLoaded(true);
    }

  }

  execute1 = function() {
    console.log('execute 1', )
    this.codeList.keys[1].forEach(codeItem => {
      console.log('execute 1', codeItem)
      codeItem.execute()
    })
  }

  logMyCodeList = function() {
    console.log('My current codeList is', this.codeList)
  }

  createFunction(name, callback, params) {
    let codeFunction = new CodeFunction(name, callback)
    if (params) {
      params.forEach((param, index) => codeFunction.setParamValue(param, index+1));
    }
    this.addCodeObjectToBench(codeFunction)
  }

  setCodeList = function (newCodeList) {
    console.log('got updated codelist', newCodeList)
    this.codeList = {...newCodeList};
        console.log('I changed my codelist to', this.codeList)
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
        // console.log(active, over)
        // console.log('Move',active.data.current.this, 'From', active.data.current.currentContainerName, 'To', over.data.current.id)
        this.moveCodeObject(active.data.current.this, active.data.current.currentContainerName, over.data.current.id)
      }
    }
  }

  //todo: need unique key
  getReactBench = function() {   
    return (
      <DndContext onDragEnd={(event) => this.handleDragEnd(event)}>
        <Droppable id="key1" className="workbench">
          {this.codeList.keys[1].map(codeObject => {
            return codeObject.reactDisplay("key1")
          })}
        </Droppable>
        <Droppable id="bench" className="workbench">
          {this.codeList.keys[0].map(codeObject => {
            return codeObject.reactDisplay("bench")
          })}
        </Droppable>
      </DndContext>
    )
  }
} 

export default WorkBench;
