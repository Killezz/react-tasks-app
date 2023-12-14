import { useState } from "react";
import TaskTags from "../components/TaskTags";
import TasksGrid from "../components/TasksGrid";

const FinishedTasks = () => {
  const [filterTags, setFilterTags] = useState([]);

  const handleTagsChange = (updatedTags) => {
    setFilterTags(updatedTags);
  };

  return (
    <>
      <div className="center">
        <h1>Finished tasks</h1>
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
        <TasksGrid filterTags={filterTags} finishedPage />
      </div>
    </>
  );
};

export default FinishedTasks;
