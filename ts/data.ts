/* exported data */
interface Data {
  favorites: Exercise[];
  workouts: Workout[];
  nextWorkoutId: number;
  viewing: null | Exercise;
  nextExerciseListItemId: number;
}

let fitlogData: Data = {
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
