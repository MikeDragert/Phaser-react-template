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
import { ITEMTYPES } from '../helpers/inventoryHelpers.js'

// and by building the objects together to create behaviour for a key
class WorkBench extends React.Component {
  constructor(codeList, workBenchFunction, loaded, setLoaded, maxCurrency) {
    super();
    this.codeList = codeList;
    this.baseMoveCodeObject = workBenchFunction.moveCodeObject;  
    this.changeMaxCurrency = workBenchFunction.changeMaxCurrency;   
    this.addToMaxCurrency = workBenchFunction.addToMaxCurrency;
    this.clearWorkbenchItems = workBenchFunction.clearWorkbenchItems; 
    this.isOnWorkbench = workBenchFunction.isOnWorkbench;  
    this.setWorkbenchHint = workBenchFunction.setWorkbenchHint;
    this.loaded = loaded;
    this.setLoaded = setLoaded;
    this.functionCallbackList = {};
    
    if (!this.loaded) {
           
      this.maxCurrency = maxCurrency;
      setLoaded = this.setLoaded(true);
    }

  }

  setFunctionCallbacks = function(functionCallbackList) {
    if (functionCallbackList === undefined) {
      return;
    }

    this.functionCallbackList = functionCallbackList;
  }

  extractCodeIdentifierFromName = function(name) {
    let values = name.split('_');
    if (values.length > 1) {
      return values[1];
    }
    return undefined;
  }

  getCodeObjectFromInventoryItem = function(inventoryItem, functionCallbackList) {
    let codeIdentifier = this.extractCodeIdentifierFromName(inventoryItem.item_name);

    if (codeIdentifier === undefined) {
      return false;
    }

    if (inventoryItem.item_type < ITEMTYPES.CODEITEMMAX) {
      switch (inventoryItem.item_type) {
        case ITEMTYPES.CODENUMBER:
          return new CodeNumber(inventoryItem.item_name, Number(codeIdentifier));
        case ITEMTYPES.CODEOPERATOR:
          return new Operator(inventoryItem.item_name, codeIdentifier);
        case ITEMTYPES.CODEFUNCTION:
          if (functionCallbackList[codeIdentifier] === undefined){
            return new CodeFunction(inventoryItem.item_name, undefined);
          }
          let temp = new CodeFunction(inventoryItem.item_name, functionCallbackList[codeIdentifier].callback);
          return temp
      }
    }
    return undefined;
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
    if (!codeObject) return;
    if (!this.isOnWorkbench(codeObject)) {
      if (codeObject instanceof CodeObject) {
        this.moveCodeObject(codeObject, undefined, 'bench')
      }
    }
  }
  
  removeCodeObjectFromBench = function(codeObject) {
    if (!codeObject) return;
    if (this.isOnWorkbench(codeObject)) {
      if (codeObject instanceof CodeObject) {
        this.moveCodeObject(codeObject, 'bench', undefined)
      }
    }
    
  }

  addInventoryItemToBench = function(inventoryItem, functionCallbackList) {
    if (inventoryItem.item_type !== ITEMTYPES.COIN) {    
      let codeObject = this.getCodeObjectFromInventoryItem(inventoryItem, functionCallbackList);
      if ((codeObject instanceof CodeFunction) && (codeObject._callback === undefined)) {
        return undefined;
      }
      this.addCodeObjectToBench(codeObject);
    }
  }

  removeInventoryItemFromBench = function(inventoryItemsToRemove) {
    let currencyChange = 0;
    inventoryItemsToRemove.forEach(inventoryItem => {
      if (inventoryItem.item_type === ITEMTYPES.COIN) {
        currencyChange++;
      } else { 
        let codeObject = this.getCodeObjectFromInventoryItem(inventoryItem, functionCallbackList);
        this.removeCodeObjectFromBench(codeObject);
      }

    });
    if (currencyChange > 0) {
      this.addToMaxCurrency(-currencyChange);
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

  logHint = function() {
    console.log(this.codeList.hint)
  }

//{this.codeList.hint}
  //todo: need unique key
  getReactBench = function() {   
    return (
      <>
        <section className='benchContainer'>
          <div className='currency'>
            <h2>{this.codeList.currentCurrency} : {this.codeList.maxCurrency}</h2>
          </div>
          <article className='noteContainer'>
            <span> {this.codeList.hint}  </span>
          </article>
          <DndContext onDragEnd={(event) => this.handleDragEnd(event)}>
            <div className='codeBoxContainer'>
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
        </section>
      </>
    )
  }
} 

export default WorkBench;
