const fs = window.require("fs");
const os = window.require("os");
const username = os.userInfo().username;
const mainAppFolder = `C:/Users/${username}/AppData/Roaming/Process Time Counter`;

export const GetFilesNamesBetweenDates = async (startDate = new Date(), endDate = new Date()) => {
  let differenceTime = endDate - startDate;
  let differenceDays = Math.round(differenceTime / (1000 * 60 * 60 * 24));

  let filesName = [];
  let allSessionsNames = fs.readdirSync(mainAppFolder + "/Sessions Json");

  let currentIterationDate = new Date(startDate);
  for (let i = 0; i <= differenceDays; i++) {
    // Same formatting as the files name
    let currentIterationFormattedDate = `${(currentIterationDate.getMonth() + 1).toString().padStart(2, "0")}-${currentIterationDate
      .getDate()
      .toString()
      .padStart(2, "0")}-${currentIterationDate.getFullYear()}`;

    // Compare the array of files name and get the same occurrences (it also takes the files with -0.json, -1.json, -2.json,...)
    const sameNames = allSessionsNames.filter((x) => x.includes(currentIterationFormattedDate));
    sameNames.forEach((name) => {
      filesName.push(name);
    });

    // Add 1 day to the next iteration
    currentIterationDate.setDate(currentIterationDate.getDate() + 1);
  }

  return filesName;
};

// Open the file by its name, and filters the files that dont have at least one of the specified processes
export const FilterFilesToSpecificProcesses = async (filesNames, filterArray) => {
  let filteredFilesNames = []
  filesNames.forEach(async (fileName) => {
    const fileJson = await readFileSync(mainAppFolder + "/Sessions Json/" + fileName);
    if(fileJson.some((x)=>filterArray.includes(x.MainWindowTitle))){
      filteredFilesNames.push(fileName)
    }
  });
  return filteredFilesNames;
};

export const readFileSync = (path) => {
  return JSON.parse(fs.readFileSync(path, "utf-8", (err, data) => data));
};
