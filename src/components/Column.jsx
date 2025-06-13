import React, { useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import Card from "./Card";

const Column = ({
  columnId,
  column,
  addTask,
  deleteTask,
  deleteColumn,
  editTaskContent,
  renameColumn,
}) => {
  const [newTask, setNewTask] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(column.name);

  const handleRename = () => {
    renameColumn(columnId, nameInput);
    setEditingName(false);
  };

  return (
    <div className="bg-gray-100 p-4 rounded w-80 flex-shrink-0 shadow-md">
      <div className="flex justify-between items-center mb-2">
        {editingName ? (
          <input
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleRename();
              }
            }}
            autoFocus
            className="text-lg font-bold border p-1 w-full"
          />
        ) : (
          <div className="relative group w-full">
            <h2
              className="text-lg font-bold cursor-pointer"
              onClick={() => setEditingName(true)}
            >
              {column.name}
            </h2>
            <div className="absolute top-full left-0 mt-1 w-max px-2 py-1 text-sm text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
              Click to rename
            </div>
          </div>
        )}
        <button
          onClick={() => deleteColumn(columnId)}
          className="text-red-500 hover:text-red-700 ml-2"
        >
          ❌
        </button>
      </div>

      <Droppable droppableId={columnId}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex flex-col gap-2 min-h-[50px]"
          >
            {column.items.map((item, index) => (
              <Card
                key={item.id}
                item={item}
                index={index}
                onDelete={() => deleteTask(columnId, item.id)}
                onEdit={() => editTaskContent(columnId, item.id)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (newTask.trim()) {
            addTask(columnId, newTask.trim());
            setNewTask("");
          }
        }}
        className="mt-4 flex"
      >
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New task"
          className="flex-1 p-1 border rounded-l"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-3 rounded-r"
        >
          ➕
        </button>
      </form>
    </div>
  );
};

export default Column;
