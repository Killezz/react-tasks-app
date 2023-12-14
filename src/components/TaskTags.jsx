import { useState } from "react";
import "./TaskTags.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import FrequentlyUsedTags from "./FrequentlyUsedTags";

const TaskTags = ({
  taskTags,
  currentlyEditingTaskTags,
  onTagsChange,
  editMode = false,
}) => {
  // Creates task tags container and provides editing functionality to them.
  const [newTag, setNewTag] = useState(null);

  const handleTagInputChange = (event) => {
    setNewTag(event.target.value);
  };

  const handleAddFrequentlyUsedTag = (event) => {
    // Adds tag from frequently used tags if its not the default value and not already added.
    const selectedValue = event.target.value;
    if (
      selectedValue !== "default" &&
      !currentlyEditingTaskTags.includes(selectedValue)
    ) {
      const updatedTags = [...currentlyEditingTaskTags, selectedValue.trim()];
      onTagsChange(updatedTags);
    }
  };

  const handleAddTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag !== "" && !currentlyEditingTaskTags.includes(trimmedTag)) {
      const updatedTags = [...currentlyEditingTaskTags, trimmedTag];
      onTagsChange(updatedTags);
    }
    setNewTag(null);
  };

  const handleRemoveTag = (index) => {
    if (editMode) {
      const updatedTags = [...currentlyEditingTaskTags];
      updatedTags.splice(index, 1);
      onTagsChange(updatedTags);
    }
  };

  return (
    <div className="task-tags">
      <div className="task-tags-container">
        {editMode
          ? currentlyEditingTaskTags.map((tag, index) => (
              <div
                key={index}
                tabIndex={0}
                role="button"
                onKeyUp={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleRemoveTag(index);
                  }
                }}
                className="task-tag"
                onClick={() => handleRemoveTag(index)}
              >
                {tag}
                <FontAwesomeIcon className="delete-tag-icon" icon={faXmark} />
              </div>
            ))
          : taskTags.map((tag, index) => (
              <div key={index} className="task-tag">
                {tag}
              </div>
            ))}
      </div>
      {editMode &&
        (newTag !== null ? (
          <input
            className="task-tag"
            autoFocus
            onBlur={handleAddTag}
            onChange={handleTagInputChange}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                handleAddTag();
              }
            }}
            value={newTag}
          />
        ) : (
          <FontAwesomeIcon
            className="add-tag-icon"
            tabIndex={0}
            role="button"
            onKeyUp={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setNewTag("");
              }
            }}
            icon={faCirclePlus}
            onClick={() => {
              setNewTag("");
            }}
          />
        ))}
      {editMode && (
        <div>
          <select
            className="frequently-used-tags"
            value="default"
            onChange={handleAddFrequentlyUsedTag}
          >
            <option value="default" disabled>
              Frequently used tags
            </option>
            <FrequentlyUsedTags />
          </select>
        </div>
      )}
    </div>
  );
};

export default TaskTags;
