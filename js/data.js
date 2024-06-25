'use strict';
let fitlogData = {
  favorites: [],
  workouts: [],
  nextWorkoutId: 1,
  viewing: null,
  nextExerciseListItemId: 1,
};
window.addEventListener('beforeunload', () => {
  const dataJSON = JSON.stringify(fitlogData);
  localStorage.setItem('fitlog-data', dataJSON);
});
const previousJSON = localStorage.getItem('fitlog-data');
if (previousJSON) {
  const parsedDataJSON = JSON.parse(previousJSON);
  fitlogData = parsedDataJSON;
}
