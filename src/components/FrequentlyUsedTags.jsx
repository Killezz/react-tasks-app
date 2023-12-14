import { useEffect, useState } from "react";

const FrequentlyUsedTags = () => {
  // This component provides frequently used tags options for dropdown.
  const [frequentlyUsedTags, setFrequentlyUsedTags] = useState([]);

  useEffect(() => {
    // Loads
    fetch(`http://localhost:3010/tasks`)
      .then((response) => response.json())
      .then((data) => {
        const allUsedTags = data.flatMap((task) => task.tags); // Gets all tags from every task on database.
        const tagCounts = {};
        allUsedTags.forEach((tag) => {
          // Goes through allUsedTags list and adds them into array containing tag count.
          if (tagCounts[tag]) {
            tagCounts[tag] += 1;
          } else {
            tagCounts[tag] = 1;
          }
        });

        const sortedTags = Object.entries(tagCounts).sort(
          // Sorts them by tag count.
          (a, b) => b[1] - a[1]
        );
        const frequentTags = sortedTags.slice(0, 15).map((tag) => tag[0]); // Returns top 15 used tags from array.
        setFrequentlyUsedTags(frequentTags);
      });
  }, []);

  return (
    <>
      {frequentlyUsedTags.map((tag, index) => (
        <option key={index} value={tag}>
          {tag}
        </option>
      ))}
    </>
  );
};

export default FrequentlyUsedTags;
