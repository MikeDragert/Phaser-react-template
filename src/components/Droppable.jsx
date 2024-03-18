import React from 'react';
import {useDroppable} from '@dnd-kit/core';

function Droppable(props) {
  const {isOver, setNodeRef} = useDroppable({
    id: `droppable-${props.id}`,
    data: {id: props.id}
  });
  const style = {
    color: isOver ? 'green' : undefined,
  };
  
  return (
    <div id={props.id} ref={setNodeRef} style={style} className={props.className}>
      {props.children}
    </div>
  );
}

export default Droppable;