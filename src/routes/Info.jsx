import addTask from "../img/add-task-btn.png";
import filterByTags from "../img/filter-by-tags.png";
import chartCustomDates from "../img/finished-task-bar-chart-custom-dates.png";
import finishedTask from "../img/finished-task.png";
import newTask from "../img/new-task.png";
import newTaskTags from "../img/new-task-tags.png";
import newTaskFrequentlyUsedTags from "../img/new-task-frequenty-used-tags.png";
import frequentlyUsedTagsPopup from "../img/frequently-used-tags.png";
import taskEditing from "../img/task-editing.png";
import taskDelete from "../img/task-editing-delete.png";

const Info = () => {
  return (
    <>
      <div className="center">
        <h1>Info</h1>
      </div>
      <section className="center">
        <h2>How to add new task?</h2>
        <p>To add a new task click following button on tasks page.</p>
        <img src={addTask} alt="add task image" />
        <p>New popup will open.</p>
        <img width={400} src={newTask} alt="new task popup" />
        <p>
          You must give task name but tags are optional <br />
          You can add new tag by clicking + symbol and to remove added tags you
          can either click on tag or x symbol.
        </p>
        <img width={400} src={newTaskTags} alt="new task tags" />
        <p>
          You can also select from top 15 frequently used tags by clicking
          following dropdown.
        </p>
        <img width={400} src={newTaskFrequentlyUsedTags} alt="" />
        <p>On dropdown you can just select tag and it will be added.</p>
        <img src={frequentlyUsedTagsPopup} alt="frequently used tags popup" />
        <p>Then just click Add Task and new task gets added to database!</p>
      </section>
      <section className="center">
        <h2>How to edit task?</h2>
        <p>
          To edit task click gear icon located on right top on each task item.
          <br />
          Then you can start editing task.
        </p>
        <p></p>
        <img width={400} src={taskEditing} alt="edit task" />
        <p>
          There you can change tags and title by clicking them. <br />
          You can also delete task by clicking delete icon.
        </p>
        <img width={400} src={taskDelete} alt="delete task icon" />
      </section>
      <section className="center">
        <h2>How to filter tasks?</h2>
        <p>
          To filter tasks by tags it works same way as adding tags. <br />
          It will only show tasks that contains all added tags.
        </p>
        <img width={400} src={filterByTags} alt="filter tasks by tags" />
      </section>
      <section className="center">
        <h2>Finished tasks</h2>
        <p>
          Finished tasks will be listed under Finished tasks page. <br />
          There you will find bar chart showing total spent minutes by day.
          <br />
          You can also see when task was created and how much time was spent on
          it.
        </p>
        <img width={400} src={finishedTask} alt="finished tasks" />
        <p>
          You can also change custom start and end dates for bar chart. <br />
          To do this simply clicking calendar icon or input number on date,
          month or year.
        </p>
        <img width={400} src={chartCustomDates} alt="custom bar chart dates" />
      </section>
      <section className="center">
        <h2>AI usage</h2>
        <p>
          I have used ChatGPT on some functions when they were not functioning
          properly. Otherwise mainly used{" "}
          <a href="https://react.dev/learn">react.dev</a> and{" "}
          <a href="https://www.w3schools.com/react/default.asp">
            W3Schools Learn React
          </a>{" "}
          pages.
        </p>
      </section>
      <section className="center">
        <h2>Total time spent on project</h2>
        <p>I have spent 35 hours making this React app.</p>
      </section>
      <section className="center">
        <h2>Most challenging features</h2>
        <ul>
          <li style={{ margin: "10px" }}>
            Making Bar chart: I was having troubles making it work and had to
            change the way data was being saved to db.json.
          </li>
          <li style={{ margin: "10px" }}>
            Tags: It took a while to make tags work. Also frequently used tags
            to get them generated from all used tags.
          </li>
          <li style={{ margin: "10px" }}>
            Features that were not done like being able to change tasks order. I
            just did not have enough time to finish these. These features would
            have required getting more knownledge like how to use react dnd and
            making it work.
          </li>
        </ul>
      </section>
      <h2 className="center">© Killezz</h2>
    </>
  );
};
export default Info;
