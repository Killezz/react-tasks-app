const setSettingsValue = (propertyName, newValue) => {
  // Sets new value for settings list in database.
  fetch(`http://localhost:3010/settings`, {
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
        throw new Error(`Error updating settings status: ${response.status}`);
      }
      console.log(`Settings ${propertyName} value updated successfully!`);
    })
    .catch((error) => {
      console.error("Error updating settings status: ", error.message);
    });
};

const getSettingsValue = (name) => {
  // Returns fetch promise that can be used like: getSettingsValue("theme").then((value) => { console.log(value); })
  return fetch(`http://localhost:3010/settings`)
    .then((response) => response.json())
    .then((data) => {
      if (data[name]) {
        return data[name];
      } else {
        return undefined;
      }
    })
    .catch((error) => {
      console.error("Error fetching settings:", error);
      return undefined;
    });
};

export { setSettingsValue, getSettingsValue };
