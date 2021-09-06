import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemStyle = (isDragging, draggableStyle) => {
  return {
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    border: "1px solid #02203c",
    // change background colour if dragging
    background: isDragging ? "#02203c" : "white",
    color: isDragging ? "white" : "#02203c",
    // styles we need to apply on draggables
    ...draggableStyle,
  };
};

const getListStyle = (isDraggingOver) => {
  return {
    // background: isDraggingOver ? "lightblue" : "lightgrey",
    listStyle: isDraggingOver ? "none" : "decimal",
    padding: 8,
  };
};

const useDraggableInPortal = () => {
  const self = useRef({}).current;

  useEffect(() => {
    const div = document.createElement("div");
    div.style.position = "absolute";
    div.style.pointerEvents = "none";
    div.style.top = "0";
    div.style.width = "100%";
    div.style.height = "100%";
    div.style.listStyleType = "none";

    self.elt = div;
    document.body.appendChild(div);
    return () => {
      document.body.removeChild(div);
    };
  }, [self]);

  return (render) =>
    (provided, ...args) => {
      const element = render(provided, ...args);
      if (provided.draggableProps.style.position === "fixed") {
        return ReactDOM.createPortal(element, self.elt);
      }
      return element;
    };
};

const DragDropTags = (props) => {
  const [items, setItems] = useState([]);
  const renderDraggable = useDraggableInPortal();

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const newItems = reorder(
      items,
      result.source.index,
      result.destination.index
    );
    setItems(newItems);
    props.reorderInstructions(newItems);
  };

  useEffect(() => {
    setItems(props.instructions);
  }, [props.instructions]);

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
            className="instruction-extension"
          >
            {items.map((item, index) => (
              <Draggable
                key={index}
                draggableId={JSON.stringify(index)}
                index={index}
                className="testing"
              >
                {renderDraggable((provided, snapshot) => (
                  <li
                    className="instruction-tag"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style
                    )}
                  >
                    {item}
                  </li>
                ))}
              </Draggable>
            ))}
            {provided.placeholder}
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DragDropTags;
