import { PARAMTYPES, ObjectParameter } from './ObjectParameter.js'
import { CodeObject } from './CodeObject.jsx'
import Draggable from './Draggable.jsx';
import Droppable from './Droppable.jsx';
const VALIDOPERATORS = "+-*/%"

class Operator extends CodeObject {
  constructor(name, operator) {
    super(name);
    this._params = [
      new ObjectParameter("value1", PARAMTYPES.NUMBER, 0),
      new ObjectParameter("value2", PARAMTYPES.NUMBER, 0)
    ];
    if (VALIDOPERATORS.includes(operator)) {
      this._operator = operator;
    } else {
      this._operator = 'INVALID';
    }
    this._returnType = PARAMTYPES.NUMBER;
    console.log(this._params)
  };

  // this will execute the logic of the code objects
  execute = function(player) {
    switch (this._operator){
      case '+':
        return this._params[0].value + this._params[1].value;
      case '-':
        return this._params[0].value - this._params[1].value;
      case '*':
        return this._params[0].value * this._params[1].value;
      case '/':
        return this._params[0].value / this._params[1].value;
      case '%':
        return this._params[0].value % this._params[1].value;
      default:
        return 0;
    }
  }

  //this will create a react object to display
  reactDisplay = function (currentContainerName) {

    return (
      <Draggable this={this} currentContainerName={currentContainerName} id={this._name} className="codeBlock codeBlock-Operator">
        <Droppable id={this._name}>
          {this._params[0].reactDisplay(this._name)} {this._operator} {this._params[1].reactDisplay(this._name)}
        </Droppable>
      </Draggable>
    )
  }

  //this can write it out as a text string 
  toString = function() {
    return `${this._params[0].name}: ${this._params[0].value} + ${this._params[1].name}: ${this._params[1].value}`;
  }
}

export {Operator};