import { PARAMTYPES, ObjectParameter } from './ObjectParameter.js'
import { CodeObject } from './CodeObject.jsx'
import Draggable from './Draggable.jsx';
import Droppable from './Droppable.jsx';


class CodeFunction extends CodeObject {
  constructor(name, callback) {
    super(name);
    this._displayName = name.split('-')[0];
    this._callback = callback;
    this._params = [
      new ObjectParameter("value", PARAMTYPES.NUMBER, 0)
    ];
    this._returnType = PARAMTYPES.NONE;
    this._cost = 4;
  };

  clone = function(appendToName) {
    let newObject = new CodeFunction(this.name + (appendToName ? appendToName : ''))
    newObject._displayName = this._displayName;
    newObject._callback = this._callback;
    newObject._cost = this._cost;
    newObject._used = this._used;
    newObject._returnType = this._returnType;
    newObject._params = [];
    this._params.forEach(param => {
      newObject._params.push(param.clone());
    })
    return newObject;
  }


  // this will execute the logic of the code objects
  execute = function() {
    return this._callback(this._params[0].value)
  }


  //this will create a react object to display
  reactDisplay = function (currentContainerName) {

    // const {attributes, listeners, setNodeRef, transform} = useDraggable({
    //   id: 'unique-id-function',
    // });

    // const style = {
    //   transform: CSS.Translate.toString(transform),
    // };
  

    // <button ref={setNodeRef} style={style} {...listeners} {...attributes} className="codeBlock-Function">{this._params[0].value}({this._params[1].value})</button>
    return (
      <Draggable this={this} currentContainerName={currentContainerName} id={this._name} className="codeBlock codeBlock-Function">
          <Droppable id={this._name}>
            {this._displayName}( {this._params[0].reactDisplay(this._name)} )
          </Droppable>
      </Draggable>
    )
  }

  //this can write it out as a text string 
  toString = function() {
    return `${this._displayName}, + ${this._params[0].reactDisplay}: ${this._params[0]._name}`;
  }
}

export {CodeFunction};