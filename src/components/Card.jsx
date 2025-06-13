import React from "react";
import { Draggable } from "@hello-pangea/dnd";

const Card = ({ item, index, onDelete, onEdit }) => {
  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="bg-white p-3 rounded shadow flex justify-between items-center"
        >
          <span className="flex-1">{item.content}</span>
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="text-blue-500 hover:text-blue-700"
              title="Edit Task"
            >
              ✏️
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-red-400 hover:text-red-600"
              title="Delete Task"
            >
              ❌
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Card;
