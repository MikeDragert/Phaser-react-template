import React from 'react';
import {useDraggable} from '@dnd-kit/core';

function Draggable(props) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: `draggable-${props.id}`,
    data: {this: props.this, currentContainerName: props.currentContainerName}
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <button id={props.id} ref={setNodeRef} style={style} {...listeners} {...attributes} className={props.className}>
      {props.children}
    </button>
  );
}

export default Draggable;