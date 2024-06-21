/* exported data */
interface Data {
  favorites: Exercise[];
}

let fitlogData: Data = {
  favorites: [],
};

window.addEventListener('beforeunload', () => {
  const dataJSON = JSON.stringify(fitlogData);
  localStorage.setItem('fitlog-data', dataJSON);
});

const previousJSON = localStorage.getItem('fitlog-data');
if (previousJSON) {
  const parsedDataJSON = JSON.parse(previousJSON);
  fitlogData = parsedDataJSON;
  console.log(fitlogData);
}
