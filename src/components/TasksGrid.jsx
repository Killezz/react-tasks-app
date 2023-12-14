import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faTrash } from "@fortawesome/free-solid-svg-icons";
import "./TasksGrid.css";
import TaskTags from "./TaskTags";
import TimeSpentChart from "./TimeSpentChart";
import { getSettingsValue } from "./settings";

const TasksGrid = ({ updateTasksGrid, finishedPage, filterTags }) => {
  // Creates task grid of all tasks and handles task editing, saving to database etc.
  const [tasks, setTasks] = useState([]);
  const [currentlyEditingTaskId, setCurrentlyEditingTaskId] = useState(null);
  const [currentlyEditingName, setCurrentlyEditingName] = useState("");
  const [currentlyEditingTaskTags, setCurrentlyEditingTaskTags] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [showFinishConfirmation, setShowFinishConfirmation] = useState(false);
  const [taskToFinish, setTaskToFinish] = useState(null);
  const currentDate = new Date();

  const dateToString = (date, pastDeltaDay = 0) => {
    // Converts date for example: 2023-12-14T00:00:00 to 2023-12-14 and if given pastDeltaDay
    // it returs day that was for example 5 days ago: 2023-12-09.
    const pastDate = new Date(date);
    pastDate.setDate(currentDate.getDate() - pastDeltaDay);
    return pastDate.toISOString().split("T")[0];
  };

  const handleTagsChange = (updatedTags) => {
    setCurrentlyEditingTaskTags(updatedTags);
  };

  const handleTaskDateChange = (taskId, propertyName, newValue) => {
    // This changes finished task bar chart date change.
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, [propertyName]: newValue } : task
      )
    );
  };

  const calculateTaskActiveTime = (task) => {
    // Calculates and converts seconds into hours minutes and seconds.
    const dailyActiveTime = task.dailyActiveTime;
    const lastDailyActiveTimeIndex = dailyActiveTime.length - 1;

    if (lastDailyActiveTimeIndex >= 0) {
      let totalActiveSeconds = 0;
      dailyActiveTime.forEach((day) => {
        totalActiveSeconds += day.activeSeconds;
      });

      if (totalActiveSeconds < 60) {
        return `${totalActiveSeconds}s`;
      } else if (totalActiveSeconds < 3600) {
        const minutes = Math.floor(totalActiveSeconds / 60);
        const remainingSeconds = totalActiveSeconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
      } else {
        const hours = Math.floor(totalActiveSeconds / 3600);
        const remainingMinutes = Math.floor((totalActiveSeconds % 3600) / 60);
        const remainingSeconds = totalActiveSeconds % 60;
        return `${hours}h ${remainingMinutes}m ${remainingSeconds}s`;
      }
    } else {
      return "0s";
    }
  };

  function formatEpochTime(millis) {
    // Formats epoch millis time into date and time string.
    const date = new Date(millis);
    const year = date.getUTCFullYear();
    const month = ("0" + (date.getUTCMonth() + 1)).slice(-2);
    const day = ("0" + date.getUTCDate()).slice(-2);
    const hours = ("0" + date.getUTCHours()).slice(-2);
    const minutes = ("0" + date.getUTCMinutes()).slice(-2);

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  const saveDailyActiveTime = (task, finishTask = false) => {
    // Saves active intervals of task under dailyActiveTime, current day and activeIntervals list
    const currentTime = Date.now();
    const currentDate = new Date().toISOString().split("T")[0];

    let dailyActiveTime = [...task.dailyActiveTime];

    if (task.startTime) {
      // If theres already task.startTime == task currently active it calculates current time - startTime milliseconds
      // and converts them to seconds.
      const activeSeconds = Math.round((currentTime - task.startTime) / 1000);
      const dateEntryIndex = dailyActiveTime.findIndex(
        // Goes through all days and if found dateEntryIndex is no longer -1.
        (dailyActiveTime) => dailyActiveTime.date === currentDate
      );
      if (dateEntryIndex !== -1) {
        // Date was found so adding activeSeconds and also activeIntervals.
        dailyActiveTime[dateEntryIndex].activeSeconds += activeSeconds;
        dailyActiveTime[dateEntryIndex].activeIntervals.push({
          startTime: task.startTime,
          endTime: currentTime,
        });
      } else {
        // Date was not found so creating new object.
        dailyActiveTime.push({
          date: currentDate,
          activeSeconds: activeSeconds,
          activeIntervals: [
            { startTime: task.startTime, endTime: currentTime },
          ],
        });
      }
      if (finishTask) {
        // If finishTask == true it also changes property value to finished and
        // it will no longer be displayed on active tasks page.
        changePropertyValue(task.id, "finished", true);
      }
      changePropertyValue(task.id, "startTime", null);
      changePropertyValue(task.id, "dailyActiveTime", dailyActiveTime);
    } else {
      if (finishTask) {
        changePropertyValue(task.id, "finished", true);
      } else {
        changePropertyValue(task.id, "startTime", currentTime);
      }
    }
  };

  const changePropertyValue = (taskId, propertyName, newValue) => {
    // Handles all editing to tasks. Must be given taskId, propertyName to change, and new value.
    fetch(`http://localhost:3010/tasks/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        [propertyName]: newValue,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error updating task status: ${response.status}`);
        }
        console.log(`Task ${propertyName} updated successfully!`);
        return response.json();
      })
      .then(() => {
        if (propertyName == "startTime" && newValue != null) {
          // If startTime is being set then check if alternativeMode is enabled.
          getSettingsValue("alternativeMode").then((value) => {
            if (value) {
              // If its enabled then go through all task that are not current task and set them to non active
              // by setting startTime to null.
              tasks.forEach((task) => {
                if (task.id !== taskId) {
                  if (task.startTime !== null) {
                    saveDailyActiveTime(task);
                  }
                }
              });
            }
          });
        }
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId ? { ...task, [propertyName]: newValue } : task
          )
        ); // This updates tasks by changing property to its new value.
      })
      .catch((error) => {
        console.error("Error updating task status: ", error.message);
      });
  };

  const finishTask = (task) => {
    saveDailyActiveTime(task, true);
    setCurrentlyEditingTaskId(null);
  };

  const deleteTask = (taskId) => {
    // Handles task deleting by id.
    fetch(`http://localhost:3010/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error deleting task status: ${response.status}`);
        }
        console.log(`Task ${taskId} deleted successfully!`);
        return response.json();
      })
      .then(() => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      })
      .catch((error) => {
        console.error("Error deleting task status: ", error.message);
      });
    setCurrentlyEditingTaskId(null);
  };

  const finishTaskClick = (task) => {
    setTaskToFinish(task);
    setShowFinishConfirmation(true);
  };

  const deleteTaskClick = (task) => {
    setTaskToDelete(task);
    setShowDeleteConfirmation(true);
  };

  const editTaskClick = (task) => {
    // When edit task is click then sets various variables that are used when editing task.
    setCurrentlyEditingTaskId(task.id);
    setCurrentlyEditingName(task.name);
    setCurrentlyEditingTaskTags(task.tags);
    setShowDeleteConfirmation(false);
    setTaskToDelete(null);
    setShowFinishConfirmation(false);
    setTaskToFinish(null);
  };

  const saveTaskChanges = () => {
    if (currentlyEditingTaskId !== null) {
      const name = currentlyEditingName.trim();
      if (name.length > 0) {
        changePropertyValue(currentlyEditingTaskId, "name", name);
      }

      changePropertyValue(
        currentlyEditingTaskId,
        "tags",
        currentlyEditingTaskTags
      );
      setCurrentlyEditingTaskId(null);
    }
  };

  const discardTaskChanges = () => {
    if (currentlyEditingTaskId !== null) {
      setCurrentlyEditingTaskId(null);
      setCurrentlyEditingName("");
      setCurrentlyEditingTaskTags([]);
    }
  };

  const handleTitleChange = (e) => {
    setCurrentlyEditingName(e.target.value);
  };

  useEffect(() => {
    // Fetches all tasks when loading page or updateTasksGrid or filterTags changes. Also if there
    // is filters it compares them by changing them both to lowercase.
    fetch(`http://localhost:3010/tasks?_sort=name&_order=asc`)
      .then((response) => response.json())
      .then((tasks) => {
        const filteredTasks = tasks.filter(
          (task) =>
            filterTags.length === 0 ||
            filterTags.every((tag) =>
              task.tags.some((taskTag) =>
                taskTag.toLowerCase().includes(tag.toLowerCase())
              )
            )
        );
        setTasks(filteredTasks);
      })
      .catch((error) => console.error("Error fetching tasks:", error));
  }, [updateTasksGrid, filterTags]);

  return (
    <>
      {/* Provides active tasks and finished tasks page component. If finishedPage is set to true then runs different code below. */}
      {tasks.length > 0 && !finishedPage
        ? tasks
            .filter((task) => !task.finished)
            .map((task) => (
              <div
                key={task.id}
                className={`task-item ${task.startTime ? "active" : ""}`}
              >
                {currentlyEditingTaskId === task.id ? (
                  <FontAwesomeIcon
                    tabIndex={0}
                    role="button"
                    onKeyUp={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        deleteTaskClick(task);
                      }
                    }}
                    icon={faTrash}
                    className="delete-task-icon"
                    onClick={() => deleteTaskClick(task)}
                  />
                ) : (
                  <FontAwesomeIcon
                    tabIndex={0}
                    role="button"
                    onKeyUp={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        editTaskClick(task);
                      }
                    }}
                    className="edit-task-icon"
                    icon={faGear}
                    onClick={() => editTaskClick(task)}
                  />
                )}
                <div className="title">
                  {currentlyEditingTaskId === task.id ? (
                    <input
                      type="text"
                      value={currentlyEditingName}
                      onChange={handleTitleChange}
                      autoFocus
                    />
                  ) : (
                    <h2>{task.name}</h2>
                  )}
                </div>
                <div className="content">
                  <div>
                    <TaskTags
                      allTasks={tasks}
                      taskTags={task.tags}
                      currentlyEditingTaskTags={currentlyEditingTaskTags}
                      onTagsChange={handleTagsChange}
                      editMode={currentlyEditingTaskId === task.id}
                    />
                  </div>
                </div>
                <div className="task-actions">
                  {currentlyEditingTaskId === task.id ? (
                    <>
                      <button
                        className="discard-changes-btn"
                        onClick={() => discardTaskChanges()}
                      >
                        Discard changes
                      </button>
                      <button
                        className="save-changes-btn"
                        onClick={() => saveTaskChanges()}
                      >
                        Save
                      </button>
                    </>
                  ) : task.startTime ? (
                    <button
                      className="pause-task-btn"
                      onClick={() => saveDailyActiveTime(task)}
                    >
                      Pause
                    </button>
                  ) : (
                    <button
                      className="continue-task-btn"
                      onClick={() => saveDailyActiveTime(task)}
                    >
                      Continue
                    </button>
                  )}
                  {currentlyEditingTaskId !== task.id && (
                    <button
                      className="finish-task-btn"
                      onClick={() => finishTaskClick(task)}
                    >
                      Finish task
                    </button>
                  )}
                </div>
                {currentlyEditingTaskId === task.id && (
                  <div
                    className={`delete-confirmation ${
                      showDeleteConfirmation ? "active" : ""
                    }`}
                  >
                    <h1>DELETE TASK</h1>
                    <p>Are you sure you want to delete this task?</p>
                    <div className="actions">
                      <button
                        className="cancel-delete-task-btn"
                        onClick={() => setShowDeleteConfirmation(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="delete-task-btn"
                        onClick={() => {
                          deleteTask(taskToDelete.id);
                          setShowDeleteConfirmation(false);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}

                <div
                  className={`finish-confirmation ${
                    taskToFinish &&
                    taskToFinish.id === task.id &&
                    showFinishConfirmation
                      ? "active"
                      : ""
                  }`}
                >
                  <h1>FINISH TASK</h1>
                  <p>Are you sure you want to finish this task?</p>
                  <div className="actions">
                    <button
                      className="cancel-finish-task-btn"
                      onClick={() => setShowFinishConfirmation(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="finish-task-btn"
                      onClick={() => {
                        finishTask(taskToFinish);
                        setShowFinishConfirmation(false);
                      }}
                    >
                      Finish task
                    </button>
                  </div>
                </div>
              </div>
            ))
        : tasks
            .filter((task) => task.finished)
            .map((task) => (
              <div key={task.id} className={`task-item`}>
                <FontAwesomeIcon
                  tabIndex={0}
                  role="button"
                  onKeyUp={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      deleteTaskClick(task);
                    }
                  }}
                  icon={faTrash}
                  className="delete-task-icon"
                  onClick={() => deleteTaskClick(task)}
                />
                <div className="title">
                  <h2>{task.name}</h2>
                </div>
                <div className="content">
                  <div>
                    <TaskTags taskTags={task.tags} />
                  </div>
                </div>
                <div className="task-actions">
                  <TimeSpentChart
                    chartStartDate={
                      task.startDate
                        ? task.startDate
                        : dateToString(currentDate, 7)
                    }
                    chartEndDate={
                      task.endDate ? task.endDate : dateToString(currentDate)
                    }
                    dailyActiveTime={task.dailyActiveTime}
                  />
                </div>
                <div>
                  <label htmlFor="end">Start date:</label>
                  <input
                    className="date-picker-input"
                    type="date"
                    id="end"
                    name="trip-start"
                    value={
                      task.startDate
                        ? task.startDate
                        : dateToString(currentDate, 7)
                    }
                    max={dateToString(currentDate)}
                    onChange={(e) =>
                      handleTaskDateChange(task.id, "startDate", e.target.value)
                    }
                  />
                  <br />
                  <label htmlFor="end">End date:</label>
                  <input
                    className="date-picker-input"
                    type="date"
                    id="end"
                    name="trip-start"
                    value={
                      task.endDate ? task.endDate : dateToString(currentDate)
                    }
                    max={dateToString(currentDate)}
                    onChange={(e) =>
                      handleTaskDateChange(task.id, "endDate", e.target.value)
                    }
                  />
                </div>
                <p>Created: {formatEpochTime(task.creationTime)}</p>
                <p>Time spent: {calculateTaskActiveTime(task)}</p>
                <div
                  className={`delete-confirmation ${
                    taskToDelete &&
                    taskToDelete.id === task.id &&
                    showDeleteConfirmation
                      ? "active"
                      : ""
                  }`}
                >
                  <h1>DELETE TASK</h1>
                  <p>Are you sure you want to delete this finished task?</p>
                  <div className="actions">
                    <button
                      className="cancel-delete-task-btn"
                      onClick={() => setShowDeleteConfirmation(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="delete-task-btn"
                      onClick={() => {
                        deleteTask(taskToDelete.id);
                        setShowDeleteConfirmation(false);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
    </>
  );
};

export default TasksGrid;
