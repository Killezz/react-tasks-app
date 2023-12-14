import { useEffect, useState } from "react";
import "./AddTaskPopup.css";
import TaskTags from "./TaskTags";

const AddTaskPopup = ({ onNewTask }) => {
  // Creates new task popup and has callback function onNewTask
  // to refresh tasks view on adding new task.
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskTags, setTaskTags] = useState([]);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setTaskName("");
    setTaskTags([]);
  };

  const handleTaskNameChange = (event) => {
    setTaskName(event.target.value);
  };

  const handleTaskTagsChange = (updatedTags) => {
    setTaskTags(updatedTags);
  };
  useEffect(() => {
    if (isPopupOpen) {
      // Autofocus was not working if set on task-name input so had to give it
      // little delay.
      setTimeout(() => {
        document.querySelector(".task-name").focus();
      }, 200);
    }
  }, [isPopupOpen]);

  const handleAddTask = async () => {
    // Adds new task to database if name lenght is not empty.
    try {
      const name = taskName.trim();
      if (name.length === 0) {
        console.error("Task name cannot be empty!");
        return;
      }

      const creationTime = Date.now(); // Task creation time is saved in epoch millis

      const newTaskData = {
        name: name,
        creationTime: creationTime,
        startTime: null,
        finished: false,
        dailyActiveTime: [],
        tags: taskTags,
      };

      const response = await fetch("http://localhost:3010/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTaskData),
      }); // Makes post request to json-server database with newTaskData object.

      if (response.ok) {
        // If request was successfull it calls callback function and closes popup.
        console.log("Task added to the database!");
        onNewTask();
        closePopup();
      } else {
        console.error("Failed to add task to the database!");
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div>
      <button onClick={openPopup} className="add-new-task-btn">
        Add task
      </button>

      <div className={`new-task-overlay ${isPopupOpen ? "active" : ""}`}>
        <div className="popup-content center">
          <h2>New Task</h2>
          <input
            className="task-name"
            type="text"
            value={taskName}
            onChange={handleTaskNameChange}
            placeholder="Task name"
          />
          <label>Tags</label>
          <TaskTags
            currentlyEditingTaskTags={taskTags}
            onTagsChange={handleTaskTagsChange}
            editMode
          />
          <div className="button-container">
            <button className="cancel-btn" onClick={closePopup}>
              Cancel
            </button>
            <button className="save-btn" onClick={handleAddTask}>
              Add Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTaskPopup;
