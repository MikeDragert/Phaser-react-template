
import { PARAMTYPES, ObjectParameter } from './ObjectParameter.js'
import { CodeObject } from './CodeObject.jsx'
import Draggable from './Draggable.jsx';

class Number extends CodeObject {
  constructor(name) {
    super(name);
    this._params = [new ObjectParameter("value", PARAMTYPES.NUMBER, 0)];
    this._returnType = PARAMTYPES.NUMBER;
  };

  //todo: we can maybe dry this up
  // I have overridden this, because it has to take an actual number and not a code object
  setParamValue = function(number, position = -1) {
    if (typeof number === 'number'){
      let updatePosition = -1;
      if ((position >=0) && (position < this._params.length)) {
        updatePosition = position;
      }
      if ( updatePosition < 0) {
        this._params.some((param, index) => {
          if (!param.hasValue()) {
            updatePosition = index;
            return true;
          }
          return false;
        });
      }

      if (updatePosition >= 0) {
        this._params[updatePosition].value = number;
        return true;
      }
    }
    return false;
  };


   // this will execute the logic of the code objects
   execute = function(player) {
    return this._params[0].value;
  }

  //this will create a react object to display
  reactDisplay = function (currentContainerName) {
    // const {attributes, listeners, setNodeRef, transform} = useDraggable({
    //   id: 'unique-id-number',
    // });

    return (
      <Draggable this={this} currentContainerName={currentContainerName} id={this._name} className='codeBlock codeBlock-Number'>{this._params[0].value}</Draggable>
    )
  }

  //this can write it out as a text string 
  toString = function() {
    return `${this._params[0].name}: ${this._params[0].value}`;
  }
}

export {Number};