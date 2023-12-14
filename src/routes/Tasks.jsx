import { useState } from "react";
import TasksGrid from "../components/TasksGrid";
import AddTaskPopup from "../components/AddTaskPopup";
import TaskTags from "../components/TaskTags";

const Tasks = () => {
  const [filterTags, setFilterTags] = useState([]);
  const [updateTasksGrid, setUpdateTasksGrid] = useState(0);

  const handleNewTask = () => {
    setUpdateTasksGrid((prevKey) => prevKey + 1);
  };

  const handleTagsChange = (updatedTags) => {
    setFilterTags(updatedTags);
  };

  return (
    <>
      <div className="center">
        <h1>Tasks</h1>
      </div>
      <div>
        <AddTaskPopup onNewTask={handleNewTask} />
      </div>
      <div className="center">
        <h2>Filter by tags</h2>
        <TaskTags
          currentlyEditingTaskTags={filterTags}
          onTagsChange={handleTagsChange}
          editMode
        />
      </div>
      <div className="task-container">
        <TasksGrid updateTasksGrid={updateTasksGrid} filterTags={filterTags} />
      </div>
    </>
  );
};

export default Tasks;
