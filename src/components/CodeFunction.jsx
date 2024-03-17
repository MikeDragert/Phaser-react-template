import {PARAMTYPES, ObjectParameter, CodeObject} from './CodeObject.jsx'
import Draggable from './Draggable.jsx';
import Droppable from './Droppable.jsx';


class CodeFunction extends CodeObject {
  constructor(name, callback) {
    super(name);
    this.callback = callback;
    this._params = [
      new ObjectParameter("value", PARAMTYPES.NUMBER, 0)
    ];
    this._returnType = PARAMTYPES.NONE;
  };

  // this will execute the logic of the code objects
  execute = function() {
    return this.callback(this._params[0].value)
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
      <Draggable this={this} currentContainerName={currentContainerName} id={this._name} className="codeBlock-Function">
          <Droppable id={this._name}>
            {this._name}({this._params[0].reactDisplay(this._name)})
          </Droppable>
      </Draggable>
    )
  }

  //this can write it out as a text string 
  toString = function() {
    return `${this._name}, + ${this._params[0].reactDisplay}: ${this._params[0].value}`;
  }
}

export {CodeFunction};