import React, { useEffect, useState } from "react";
import Column from "./Column";
import { DragDropContext } from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";

const KanbanBoard = () => {
  const [columns, setColumns] = useState(() => {
    const saved = localStorage.getItem("kanbanData");
    if (saved) return JSON.parse(saved);
    return {
      [uuidv4()]: { name: "To Do", items: [] },
      [uuidv4()]: { name: "In Progress", items: [] },
      [uuidv4()]: { name: "Done", items: [] },
    };
  });
  const [editTask, setEditTask] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    localStorage.setItem("kanbanData", JSON.stringify(columns));
  }, [columns]);

  const onDragEnd = ({ source, destination }) => {
    if (!destination) return;

    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];
    const [moved] = sourceCol.items.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceCol.items.splice(destination.index, 0, moved);
    } else {
      destCol.items.splice(destination.index, 0, moved);
    }
    setColumns({ ...columns });
  };

  const editTaskContent = (colId, taskId) => {
    const task = columns[colId].items.find((t) => t.id === taskId);
    if (!task) return;
    setEditTask({ colId, taskId });
    setEditText(task.content);
  };

  const renameColumn = (colId, newName) => {
    const updated = { ...columns };
    updated[colId].name = newName;
    setColumns(updated);
  };

  const saveTaskEdit = () => {
    if (!editTask) return;
    const updatedColumns = { ...columns };
    const taskList = updatedColumns[editTask.colId].items;
    const taskIndex = taskList.findIndex((t) => t.id === editTask.taskId);
    if (taskIndex === -1) return;

    taskList[taskIndex].content = editText;
    setColumns(updatedColumns);
    setEditTask(null);
    setEditText("");
  };

  const addColumn = () => {
    const id = uuidv4();
    setColumns({ ...columns, [id]: { name: "New Column", items: [] } });
  };

  const deleteColumn = (colId) => {
    const updated = { ...columns };
    delete updated[colId];
    setColumns(updated);
  };

  const addTask = (colId, content) => {
    const newTask = { id: uuidv4(), content };
    columns[colId].items.push(newTask);
    setColumns({ ...columns });
  };

  const deleteTask = (colId, taskId) => {
    columns[colId].items = columns[colId].items.filter((i) => i.id !== taskId);
    setColumns({ ...columns });
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-indigo-600 mb-6">
        📂 Kanban Board
      </h1>
      <div className="flex justify-center mb-4">
        <button
          onClick={addColumn}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
        >
          + Add Column
        </button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-6">
          {Object.entries(columns).map(([id, col]) => (
            <Column
              key={id}
              columnId={id}
              column={col}
              addTask={addTask}
              deleteTask={deleteTask}
              deleteColumn={deleteColumn}
              editTaskContent={editTaskContent}
              renameColumn={renameColumn}
            />
          ))}
        </div>
      </DragDropContext>

      {editTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow w-96">
            <h2 className="text-lg font-bold mb-2">Edit Task</h2>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full border p-2 mb-4 rounded"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditTask(null)}
                className="bg-gray-300 px-4 py-1 rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveTaskEdit}
                className="bg-blue-500 text-white px-4 py-1 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default KanbanBoard;
