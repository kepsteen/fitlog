'use strict';
let exerciseObjArr = [];
const $searchForm = document.querySelector('#search-form');
const $views = document.querySelectorAll('section');
const $beginBtn = document.querySelector('#begin');
const $exercisesCardList = document.querySelector('#exercises-card-list');
const $header = document.querySelector('header');
const $hamburger = document.querySelector('.hamburger');
const $hamburgerLinks = document.querySelector('.hamburger-links');
const $noResults = document.querySelector('.no-results');
const $detailsTitle = document.querySelector('.details-title');
const $detailsImg = document.querySelector('#details-img');
const $detailsMusclePrim = document.querySelector('#details-muscle-prim');
const $detailsMuscleSec = document.querySelector('#details-muscle-sec');
const $detailsEquipment = document.querySelector('#details-equipment');
const $detailsDescription = document.querySelector('#details-description');
const $exerciseDetailSection = document.querySelector('#details-section');
const $detailsHeart = document.querySelector('.title-container > .fa-heart');
const $favoritesCardList = document.querySelector('#favorites-card-list');
const $favoritesCta = document.querySelector('#favorites-cta');
const $newWorkoutForm = document.querySelector('.new-workout-form');
const $addExerciseBtn = document.querySelector('.add-exercise-btn');
const $addExerciseModal = document.querySelector('.add-exercise-modal');
const $addExerciseForm = document.querySelector('#add-exercise-form');
if (!$searchForm) throw new Error('no search form found');
if (!$views) throw new Error('no views found');
if (!$beginBtn) throw new Error('no begin button found');
if (!$exercisesCardList) throw new Error('no card list found');
if (!$header) throw new Error('no header found');
if (!$noResults) throw new Error('no results not found');
if (!$detailsTitle) throw new Error('no title details found');
if (!$detailsImg) throw new Error('no img details found');
if (!$detailsMusclePrim) throw new Error('no prim muscle details found');
if (!$detailsMuscleSec) throw new Error('no sec muscle details found');
if (!$detailsEquipment) throw new Error('no equipment details found');
if (!$detailsDescription) throw new Error('no description details found');
if (!$exerciseDetailSection) throw new Error('no exercise view section found');
if (!$detailsHeart) throw new Error('no heart found');
if (!$favoritesCardList) throw new Error('no favorite cardlist found');
if (!$favoritesCta) throw new Error('no favorites cta found');
if (!$newWorkoutForm) throw new Error('no new workout form');
if (!$addExerciseBtn) throw new Error('no add exercise btn found');
if (!$addExerciseModal) throw new Error('no add exercise modal found');
if (!$addExerciseForm) throw new Error('no add exercise form found');
function renderExercises(exerciseObj) {
  const $card = document.createElement('div');
  $card.setAttribute('class', 'card flex space-between');
  $card.setAttribute('data-base-id', `${exerciseObj.baseId}`);
  const $cardImg = document.createElement('img');
  $cardImg.setAttribute('src', exerciseObj.image);
  $cardImg.setAttribute('class', 'card-img');
  const $cardText = document.createElement('div');
  $cardText.setAttribute('class', 'card-text flex flex-col space-between');
  const $cardTitle = document.createElement('h3');
  $cardTitle.textContent = exerciseObj.name;
  const $cardIcons = document.createElement('div');
  $cardIcons.setAttribute('class', 'card-icons flex justify-end');
  const $heart = document.createElement('i');
  if (exerciseObj.favorite) {
    $heart.setAttribute('class', 'fa-solid fa-heart');
  } else {
    $heart.setAttribute('class', 'fa-regular fa-heart');
  }
  $heart.setAttribute('style', 'color: #FFC300;');
  const $pencil = document.createElement('i');
  $pencil.setAttribute('class', 'fa-solid fa-pen-to-square');
  $pencil.setAttribute('style', 'color: #001d3d');
  $cardIcons.appendChild($pencil);
  $cardIcons.appendChild($heart);
  $cardText.appendChild($cardTitle);
  $cardText.appendChild($cardIcons);
  $card.appendChild($cardImg);
  $card.appendChild($cardText);
  return $card;
}
async function fetchExerciseDetails(baseId, id, img) {
  const response = await fetch(
    `https://wger.de/api/v2/exercisebaseinfo/${baseId}/`,
  );
  if (!response.ok) {
    throw new Error(`HTTP Error: Status ${response.status}`);
  }
  const data = await response.json();
  const primaryMuscles = [];
  const secondaryMuscles = [];
  const equipment = [];
  let exerciseName = '';
  let exerciseDescription = '';
  let favorited = false;
  for (const muscle of data.muscles) {
    primaryMuscles.push({
      name: muscle.name,
      nameEn: muscle.name_en,
      id: muscle.id,
    });
  }
  for (const muscle of data.muscles_secondary) {
    secondaryMuscles.push({
      name: muscle.name,
      nameEn: muscle.name_en,
      id: muscle.id,
    });
  }
  for (const exercise of data.exercises) {
    if (exercise.id === id) {
      exerciseName = exercise.name;
      exerciseDescription = exercise.description;
    }
  }
  for (const element of data.equipment) {
    equipment.push({
      id: element.id,
      name: element.name,
    });
  }
  for (const element of fitlogData.favorites) {
    if (baseId === element.baseId) {
      favorited = true;
    }
  }
  const exerciseObj = {
    name: exerciseName,
    description: exerciseDescription,
    primaryMuscles,
    secondaryMuscles,
    equipment,
    baseId,
    image: img,
    id,
    favorite: favorited,
  };
  return exerciseObj;
}
async function fetchExerciseSearchData(term) {
  try {
    const response = await fetch(
      `https://wger.de/api/v2/exercise/search/?language=2&term=${term}`,
    );
    if (!response.ok) {
      throw new Error(`HTTP Error: Status ${response.status}`);
    }
    const data = await response.json();
    exerciseObjArr = [];
    for (let i = 0; i < data.suggestions.length; i++) {
      if (data.suggestions[i].data.image !== null) {
        const exerciseObj = await fetchExerciseDetails(
          data.suggestions[i].data.base_id,
          data.suggestions[i].data.id,
          'https://wger.de' + data.suggestions[i].data.image,
        );
        exerciseObjArr.push(exerciseObj);
      }
    }
    if (exerciseObjArr.length > 0) {
      exerciseObjArr.forEach((element) => {
        $exercisesCardList.appendChild(renderExercises(element));
      });
      $noResults?.classList.add('hidden');
    } else {
      $noResults?.classList.remove('hidden');
    }
  } catch (error) {
    console.error(error);
  }
}
function viewSwap(view) {
  for (let i = 0; i < $views.length; i++) {
    if ($views[i].dataset.view === view) {
      $views[i].classList.remove('hidden');
    } else {
      $views[i].classList.add('hidden');
    }
  }
}
function clearCardList() {
  while ($exercisesCardList.hasChildNodes()) {
    const child = $exercisesCardList.firstChild;
    $exercisesCardList.removeChild(child);
  }
}
function findExerciseByBaseId(baseId) {
  for (const exercise of exerciseObjArr) {
    if (exercise.baseId === baseId) {
      return exercise;
    }
  }
  for (const exercise of fitlogData.favorites) {
    if (exercise.baseId === baseId) {
      return exercise;
    }
  }
  for (const workout of fitlogData.workouts) {
    for (const exercise of workout.exercises) {
      if (exercise.baseId === baseId) {
        return exercise;
      }
    }
  }
  return null;
}
function handleFavoriteClick(exerciseObj, targetIcon) {
  const $favoritesNodeList = document.querySelectorAll(
    '#favorites-card-list > .card',
  );
  if (!$favoritesNodeList) throw new Error('no favorites node list found');
  if (targetIcon.classList.contains('fa-regular')) {
    targetIcon.classList.remove('fa-regular');
    targetIcon.classList.add('fa-solid');
    exerciseObj.favorite = true;
    fitlogData.favorites.push(exerciseObj);
    $favoritesCardList.appendChild(renderExercises(exerciseObj));
    $favoritesCta.classList.add('hidden');
  } else if (targetIcon.classList.contains('fa-solid')) {
    targetIcon.classList.remove('fa-solid');
    targetIcon.classList.add('fa-regular');
    exerciseObj.favorite = false;
    let indexToRemove = -1;
    for (let i = 0; i < fitlogData.favorites.length; i++) {
      if (fitlogData.favorites[i].baseId === exerciseObj.baseId) {
        indexToRemove = i;
      }
    }
    fitlogData.favorites.splice(indexToRemove, 1);
    for (let i = 0; i < $favoritesNodeList.length; i++) {
      const nodeBaseId = $favoritesNodeList[i].dataset.baseId;
      if (parseInt(nodeBaseId) === exerciseObj.baseId) {
        $favoritesCardList.removeChild($favoritesNodeList[i]);
      }
    }
    if (fitlogData.favorites.length === 0)
      $favoritesCta.classList.remove('hidden');
  }
  const $exercisesNodeList = document.querySelectorAll(
    '#exercises-card-list > .card',
  );
  if (!$exercisesNodeList) throw new Error('no exercise nodelist found');
  for (let i = 0; i < $exercisesNodeList.length; i++) {
    const nodeBaseId = $exercisesNodeList[i].dataset.baseId;
    if (parseInt(nodeBaseId) === exerciseObj.baseId) {
      const $heartIcon = $exercisesNodeList[i].lastElementChild;
      if (exerciseObj.favorite) {
        $heartIcon?.classList.remove('fa-regular');
        $heartIcon?.classList.add('fa-solid');
      } else {
        $heartIcon?.classList.add('fa-regular');
        $heartIcon?.classList.remove('fa-solid');
      }
    }
  }
}
function populateExerciseDetails(exercise) {
  $exerciseDetailSection.setAttribute('data-base-id', `${exercise.baseId}`);
  $detailsTitle.textContent = exercise.name + ' ';
  if (exercise.favorite)
    $detailsHeart.setAttribute('class', 'fa-solid fa-heart');
  if (!exercise.favorite)
    $detailsHeart.setAttribute('class', 'fa-regular fa-heart');
  $detailsImg.setAttribute('src', exercise.image);
  if (exercise.primaryMuscles.length > 0) {
    $detailsMusclePrim.textContent = '';
    for (const muscle of exercise.primaryMuscles) {
      $detailsMusclePrim.textContent += `${muscle.name}, `;
    }
  } else {
    $detailsMusclePrim.textContent = 'no data found.';
  }
  if (exercise.secondaryMuscles.length > 0) {
    $detailsMuscleSec.textContent = '';
    for (const muscle of exercise.secondaryMuscles) {
      $detailsMuscleSec.textContent += `${muscle.name}, `;
    }
  } else {
    $detailsMuscleSec.textContent = 'no data found.';
  }
  if (exercise.equipment.length > 0) {
    $detailsEquipment.textContent = '';
    for (const equipment of exercise.equipment) {
      $detailsEquipment.textContent += `${equipment.name}, `;
    }
  } else {
    $detailsEquipment.textContent = 'no data found.';
  }
  $detailsDescription.innerHTML = exercise.description;
}
function renderAddExerciseForm() {
  fitlogData.workouts.forEach((workout) => {
    const $div = document.createElement('div');
    const $label = document.createElement('label');
    $label.setAttribute('for', `${workout.workoutId}`);
    $label.textContent = `${workout.name}`;
    const $checkbox = document.createElement('input');
    $checkbox.setAttribute('type', 'checkbox');
    $checkbox.setAttribute('name', `workout-${workout.workoutId}-checkbox`);
    $checkbox.setAttribute('id', `workout-${workout.workoutId}`);
    $checkbox.setAttribute('value', `${workout.workoutId}`);
    $div.appendChild($label);
    $div.appendChild($checkbox);
    $addExerciseForm.appendChild($div);
  });
  const $div = document.createElement('div');
  $div.setAttribute('class', 'flex justify-center');
  const $submitBtn = document.createElement('button');
  $submitBtn.setAttribute('type', 'submit');
  $submitBtn.setAttribute('class', 'yellow-btn');
  $submitBtn.textContent = 'Submit';
  $div.appendChild($submitBtn);
  $addExerciseForm.appendChild($div);
}
// function to render the workouts
function renderWorkouts(workout) {
  const $workoutDiv = document.createElement('div');
  $workoutDiv.setAttribute('class', 'workout');
  $workoutDiv.setAttribute('data-workout-id', `${workout.workoutId}`);
  const $workoutTitleDiv = document.createElement('div');
  $workoutTitleDiv.setAttribute('class', 'workout-title flex');
  $workoutTitleDiv.setAttribute('style', 'gap: 10px');
  const $workoutTitleH1 = document.createElement('h1');
  $workoutTitleH1.textContent = workout.name;
  const $iconContainerDiv = document.createElement('div');
  $iconContainerDiv.setAttribute('class', 'caret-container flex align-center');
  const $icon = document.createElement('i');
  $icon.setAttribute('class', 'fa-solid fa-caret-right');
  $icon.setAttribute('data-workout-id', `${workout.workoutId}`);
  $iconContainerDiv.appendChild($icon);
  $workoutTitleDiv.appendChild($workoutTitleH1);
  $workoutTitleDiv.appendChild($iconContainerDiv);
  const $workoutDataContainer = document.createElement('div');
  $workoutDataContainer.setAttribute(
    'class',
    'workout-data-container flex hidden',
  );
  $workoutDataContainer.setAttribute('style', 'gap: 20px');
  $workoutDataContainer.setAttribute('data-workout-id', `${workout.workoutId}`);
  const $exercisesDiv = document.createElement('div');
  console.log('workout', workout);
  $exercisesDiv.setAttribute('class', 'exercises');
  if (workout.exercises.length === 0) $exercisesDiv.classList.add('hidden');
  const $exercisesH3 = document.createElement('h3');
  $exercisesH3.textContent = 'Exercises';
  const $exercisesUl = document.createElement('ul');
  workout.exercises.forEach((exercise) => {
    const $exerciseLi = document.createElement('li');
    $exerciseLi.setAttribute('data-base-id', `${exercise.baseId}`);
    // make it draggable
    $exerciseLi.setAttribute('data-workout-id', `${workout.workoutId}`);
    $exerciseLi.setAttribute('draggable', 'true');
    const $strong = document.createElement('strong');
    $strong.textContent = exercise.name + ':';
    $exerciseLi.appendChild($strong);
    const textNode = document.createTextNode(' 3 x 10-12 reps');
    $exerciseLi.appendChild(textNode);
    $exercisesUl.appendChild($exerciseLi);
  });
  $exercisesDiv.appendChild($exercisesH3);
  $exercisesDiv.appendChild($exercisesUl);
  $workoutDataContainer.appendChild($exercisesDiv);
  const $daysContainerDiv = document.createElement('div');
  $daysContainerDiv.setAttribute('class', 'days-container flex wrap');
  for (let i = 0; i < workout.days.length; i++) {
    let numDay = i + 1;
    const $dayDiv = document.createElement('div');
    $dayDiv.setAttribute('class', 'day');
    const $dayH3 = document.createElement('h3');
    $dayH3.textContent = `Day ${numDay}`;
    const $dayUl = document.createElement('ul');
    $dayUl.setAttribute('data-num-day', `${numDay}`);
    $dayUl.setAttribute('class', `target-${workout.workoutId}`);
    workout.days[i][numDay].forEach((exercise) => {
      const $exerciseLi = document.createElement('li');
      $exerciseLi.setAttribute('data-base-id', `${exercise.baseId}`);
      $exerciseLi.setAttribute('data-workout-id', `${workout.workoutId}`);
      const $strong = document.createElement('strong');
      $strong.textContent = exercise.name + ':';
      $exerciseLi.appendChild($strong);
      const textNode = document.createTextNode(' 3 x 10-12 reps');
      $exerciseLi.appendChild(textNode);
      $dayUl.appendChild($exerciseLi);
    });
    $dayDiv.appendChild($dayH3);
    $dayDiv.appendChild($dayUl);
    $daysContainerDiv.appendChild($dayDiv);
  }
  $workoutDataContainer.appendChild($daysContainerDiv);
  $workoutDiv.appendChild($workoutTitleDiv);
  $workoutDiv.appendChild($workoutDataContainer);
  return $workoutDiv;
}
// Example usage
const workout = {
  workoutId: 1,
  name: 'Workout render',
  days: [{ 1: [] }, { 2: [] }, { 3: [] }, { 4: [] }, { 5: [] }],
  exercises: [
    {
      name: 'squat',
      image: '',
      baseId: 1,
      id: 100,
      description: 'squat description',
      primaryMuscles: [],
      secondaryMuscles: [],
      equipment: [],
      favorite: false,
    },
    {
      name: 'lunge',
      image: '',
      baseId: 2,
      id: 101,
      description: 'squat description',
      primaryMuscles: [],
      secondaryMuscles: [],
      equipment: [],
      favorite: false,
    },
  ],
};
const workout2 = {
  workoutId: 2,
  name: 'Workout 2 render',
  days: [{ 1: [] }, { 2: [] }, { 3: [] }, { 4: [] }, { 5: [] }],
  exercises: [
    {
      name: 'squat',
      image: '',
      baseId: 1,
      id: 100,
      description: 'squat description',
      primaryMuscles: [],
      secondaryMuscles: [],
      equipment: [],
      favorite: false,
    },
    {
      name: 'lunge',
      image: '',
      baseId: 2,
      id: 101,
      description: 'squat description',
      primaryMuscles: [],
      secondaryMuscles: [],
      equipment: [],
      favorite: false,
    },
  ],
};
const workout3 = {
  workoutId: 3,
  name: 'Workout 3 render',
  days: [{ 1: [] }, { 2: [] }, { 3: [] }, { 4: [] }, { 5: [] }],
  exercises: [
    {
      name: 'squat',
      image: '',
      baseId: 1,
      id: 100,
      description: 'squat description',
      primaryMuscles: [],
      secondaryMuscles: [],
      equipment: [],
      favorite: false,
    },
    {
      name: 'lunge',
      image: '',
      baseId: 2,
      id: 101,
      description: 'squat description',
      primaryMuscles: [],
      secondaryMuscles: [],
      equipment: [],
      favorite: false,
    },
    {
      name: 'push up',
      image: '',
      baseId: 5,
      id: 105,
      description: 'squat description',
      primaryMuscles: [],
      secondaryMuscles: [],
      equipment: [],
      favorite: false,
    },
  ],
};
const workout4 = {
  workoutId: 4,
  name: 'Workout 4 render',
  days: [{ 1: [] }, { 2: [] }, { 3: [] }, { 4: [] }, { 5: [] }],
  exercises: [
    {
      name: 'bench',
      image: '',
      baseId: 3,
      id: 102,
      description: 'squat description',
      primaryMuscles: [],
      secondaryMuscles: [],
      equipment: [],
      favorite: false,
    },
    {
      name: 'pull up',
      image: '',
      baseId: 4,
      id: 103,
      description: 'squat description',
      primaryMuscles: [],
      secondaryMuscles: [],
      equipment: [],
      favorite: false,
    },
    {
      name: 'squat',
      image: '',
      baseId: 1,
      id: 100,
      description: 'squat description',
      primaryMuscles: [],
      secondaryMuscles: [],
      equipment: [],
      favorite: false,
    },
  ],
};
const $workoutsSection = document.querySelector('.workouts');
if (!$workoutsSection) throw new Error('no workouts section');
const ExWorkoutArr = [workout, workout2, workout3, workout4];
// if (fitlogData.workouts.length === 0) {
//   ExWorkoutArr.forEach((workout) => {
//     fitlogData.workouts.push(workout);
//   });
// }
// $workoutsSection.appendChild(renderWorkouts(workout));
// $workoutsSection.appendChild(renderWorkouts(workout2));
// $workoutsSection.appendChild(renderWorkouts(workout3));
// $workoutsSection.appendChild(renderWorkouts(workout4));
// createDragNDropEventListeners(workout.workoutId);
// createDragNDropEventListeners(workout2.workoutId);
// createDragNDropEventListeners(workout3.workoutId);
// createDragNDropEventListeners(workout4.workoutId);
function handleCaretClick(workoutId, caretIcon) {
  // goal to hide the other workouts and reset the caret
  const $workoutNodeList = document.querySelectorAll('.workout-data-container');
  $workoutNodeList.forEach((workoutNode) => {
    if (!workoutNode.dataset.workoutId) return;
    if (parseInt(workoutNode.dataset.workoutId) === workoutId) {
      if (caretIcon.classList.contains('fa-caret-down')) {
        caretIcon.classList.remove('fa-caret-down');
        caretIcon.classList.add('fa-caret-right');
        workoutNode.classList.add('hidden');
      } else if (caretIcon.classList.contains('fa-caret-right')) {
        caretIcon.classList.remove('fa-caret-right');
        caretIcon.classList.add('fa-caret-down');
        workoutNode.classList.remove('hidden');
      }
    } else if (parseInt(workoutNode.dataset.workoutId) !== workoutId) {
      const caretNodeList = document.querySelectorAll('.fa-caret-down');
      caretNodeList.forEach((caret) => {
        if (!caret.dataset.workoutId) return;
        if (parseInt(caret.dataset.workoutId) !== workoutId) {
          caret.classList.remove('fa-caret-down');
          caret.classList.add('fa-caret-right');
        }
      });
      workoutNode.classList.add('hidden');
    }
  });
}
function createDragNDropEventListeners(workoutId) {
  // do something
  const $workout = document.querySelector(`[data-workout-id="${workoutId}"]`);
  if (!$workout) throw new Error('no workout container found');
  const $exercisesNodeList = $workout.querySelectorAll(
    `li[data-workout-id="${workoutId}"]`,
  );
  if (!$exercisesNodeList) throw new Error('no exercises container list found');
  console.log('exercises node list', $exercisesNodeList);
  $exercisesNodeList.forEach((element) => {
    element.addEventListener('dragstart', (event) => {
      console.log('dragging');
      if (event.dataTransfer) {
        event.dataTransfer.clearData();
        event.dataTransfer.setData('text/plain', element.dataset.baseId);
      }
    });
  });
  const $targetsNodeList = $workout.querySelectorAll(`.target-${workoutId}`);
  if (!$targetsNodeList) throw new Error('no targets node list found');
  $targetsNodeList.forEach((element) => {
    element.addEventListener('click', () => {
      console.log('target clicked');
    });
    element.addEventListener('dragover', (event1) => {
      event1.preventDefault();
    });
    element.addEventListener('drop', (event2) => {
      event2.preventDefault();
      if (event2.dataTransfer) {
        const data = event2.dataTransfer.getData('text');
        const source = $workout.querySelector(`[data-base-id="${data}"]`);
        if (source) {
          source.setAttribute('draggable', 'false');
          element?.appendChild(source);
        }
        console.log('target', event2.target);
        const $eventTarget = event2.target;
        const targetNumDay = $eventTarget.closest('ul')?.dataset.numDay;
        if (!targetNumDay) return;
        assignExercisesToDays(
          parseInt(data),
          parseInt(targetNumDay),
          workoutId,
        );
        event2.dataTransfer.clearData();
      }
    });
  });
}
// listen for click event on carat get the databaseWorkoutid
function renderAddedExercise(workoutIdArr, exercise) {
  const $workoutsNodeList = document.querySelectorAll('.workout');
  workoutIdArr.forEach((id) => {
    for (const workoutNode of $workoutsNodeList) {
      if (
        workoutNode.dataset.workoutId &&
        id === parseInt(workoutNode.dataset.workoutId)
      ) {
        console.log('ids match');
        console.log(exercise);
        const li = document.createElement('li');
        li.setAttribute('data-base-id', `${exercise.baseId}`);
        li.setAttribute('data-workout-id', `${workoutNode.dataset.workoutId}`);
        li.setAttribute('draggable', 'true');
        const $strong = document.createElement('strong');
        $strong.textContent = exercise.name;
        li.appendChild($strong);
        // li.textContent = exercise.name;
        console.log('li', li);
        const $exercisesDiv = workoutNode.querySelector('.exercises');
        if (!$exercisesDiv) throw new Error('no exercises div found');
        $exercisesDiv.classList.remove('hidden');
        const $ulElement = workoutNode.querySelector('.exercises > ul');
        if (!$ulElement) throw new Error('no ul element found');
        $ulElement.appendChild(li);
        const newExerciseElement = workoutNode.querySelector(
          `[data-base-id='${exercise.baseId}']`,
        );
        if (newExerciseElement) {
          newExerciseElement.addEventListener('dragstart', (event) => {
            console.log('dragging');
            if (event.dataTransfer) {
              event.dataTransfer.clearData();
              event.dataTransfer.setData(
                'text/plain',
                newExerciseElement.dataset.baseId,
              );
            }
          });
        }
      }
    }
  });
}
function assignExercisesToDays(baseId, numDay, workoutId) {
  //search the workouts for the matching workoutId
  // Search the workout for the day object with the corresponding numDay
  // push the exercise to the day array
  console.log('base id: ', baseId, 'numDay', numDay, 'workoutId', workoutId);
  const matchingWorkout = fitlogData.workouts.filter(
    (workout) => workout.workoutId === workoutId,
  );
  for (const workout of fitlogData.workouts) {
    if (workout.workoutId === workoutId) {
      let indexToRemove = null;
      for (let i = 0; i < workout.exercises.length; i++) {
        if (workout.exercises[i].baseId === baseId) {
          indexToRemove = i;
          break;
        }
      }
      if (indexToRemove !== null) {
        const exerciseRemoved = workout.exercises.splice(indexToRemove, 1);
        const foundDay = workout.days.find((day) => day[numDay] !== undefined);
        if (!foundDay) return;
        foundDay[numDay].push(exerciseRemoved[0]);
      }
    }
  }
  console.log(matchingWorkout);
  console.log(fitlogData.workouts);
}
$workoutsSection.addEventListener('click', (event) => {
  const $eventTarget = event.target;
  console.log($eventTarget);
  if ($eventTarget.tagName === 'I') {
    const $workoutContainer = $eventTarget.closest('.workout');
    const workoutId = $workoutContainer.dataset.workoutId;
    console.log('workout id', workoutId);
    if (workoutId) handleCaretClick(parseInt(workoutId), $eventTarget);
  }
});
document.addEventListener('DOMContentLoaded', () => {
  fitlogData.favorites.forEach((exercise) => {
    $favoritesCardList.appendChild(renderExercises(exercise));
  });
  if (fitlogData.favorites.length === 0)
    $favoritesCta.classList.remove('hidden');
  fitlogData.workouts.forEach((workout) => {
    $workoutsSection.appendChild(renderWorkouts(workout));
    createDragNDropEventListeners(workout.workoutId);
  });
});
$beginBtn.addEventListener('click', () => {
  viewSwap('exercises-view');
});
$searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  clearCardList();
  const $exerciseSearch = document.querySelector('#exercise-search');
  if (!$exerciseSearch) throw new Error('no exercise search input found');
  fetchExerciseSearchData($exerciseSearch.value);
  $searchForm.reset();
});
$header.addEventListener('click', (event) => {
  const $eventTarget = event.target;
  if ($eventTarget.classList.contains('hamburger')) {
    $hamburger?.classList.toggle('hidden');
    $hamburgerLinks?.classList.toggle('hidden');
  } else if ($eventTarget.classList.contains('fa-x')) {
    $hamburger?.classList.toggle('hidden');
    $hamburgerLinks?.classList.toggle('hidden');
  } else if ($eventTarget.classList.contains('exercises-view-anchor')) {
    viewSwap('exercises-view');
    if ($eventTarget.classList.contains('hamburger-link')) {
      $hamburger?.classList.toggle('hidden');
      $hamburgerLinks?.classList.toggle('hidden');
    }
  } else if ($eventTarget.classList.contains('favorites-view-anchor')) {
    viewSwap('favorites-view');
    if ($eventTarget.classList.contains('hamburger-link')) {
      $hamburger?.classList.toggle('hidden');
      $hamburgerLinks?.classList.toggle('hidden');
    }
  } else if ($eventTarget.classList.contains('new-workout-view-anchor')) {
    viewSwap('new-workout');
    if ($eventTarget.classList.contains('hamburger-link')) {
      $hamburger?.classList.toggle('hidden');
      $hamburgerLinks?.classList.toggle('hidden');
    }
  } else if ($eventTarget.classList.contains('home-view-anchor')) {
    viewSwap('home');
  } else if ($eventTarget.classList.contains('workouts-view-anchor')) {
    viewSwap('workouts-view');
    if ($eventTarget.classList.contains('hamburger-link')) {
      $hamburger?.classList.toggle('hidden');
      $hamburgerLinks?.classList.toggle('hidden');
    }
  }
});
$exercisesCardList.addEventListener('click', (event) => {
  const $eventTarget = event.target;
  if ($eventTarget.closest('.card-list > .card')) {
    const $card = $eventTarget.closest('.card');
    if ($card.dataset.baseId) {
      const cardBaseId = $card.dataset.baseId;
      if ($eventTarget.tagName !== 'I') {
        const exercise = findExerciseByBaseId(parseInt(cardBaseId));
        if (!exercise) return;
        fitlogData.viewing = exercise;
        populateExerciseDetails(exercise);
        viewSwap('exercise-details');
      } else if (
        $eventTarget.tagName === 'I' &&
        $eventTarget.classList.contains('fa-heart')
      ) {
        const exercise = findExerciseByBaseId(parseInt(cardBaseId));
        if (exercise) handleFavoriteClick(exercise, $eventTarget);
        fitlogData.viewing = exercise;
      } else if ($eventTarget.classList.contains('fa-pen-to-square')) {
        const exercise = findExerciseByBaseId(parseInt(cardBaseId));
        fitlogData.viewing = exercise;
        renderAddExerciseForm();
        $addExerciseModal.showModal();
      }
    }
  }
});
$favoritesCardList.addEventListener('click', (event) => {
  const $eventTarget = event.target;
  if ($eventTarget.closest('.card-list > .card')) {
    const $card = $eventTarget.closest('.card');
    if ($card.dataset.baseId) {
      const cardBaseId = $card.dataset.baseId;
      if ($eventTarget.tagName !== 'I') {
        const exercise = findExerciseByBaseId(parseInt(cardBaseId));
        if (!exercise) return;
        fitlogData.viewing = exercise;
        populateExerciseDetails(exercise);
        viewSwap('exercise-details');
      } else if (
        $eventTarget.tagName === 'I' &&
        $eventTarget.classList.contains('fa-heart')
      ) {
        const exercise = findExerciseByBaseId(parseInt(cardBaseId));
        if (exercise) handleFavoriteClick(exercise, $eventTarget);
      } else if ($eventTarget.classList.contains('fa-pen-to-square')) {
        const exercise = findExerciseByBaseId(parseInt(cardBaseId));
        fitlogData.viewing = exercise;
        renderAddExerciseForm();
        $addExerciseModal.showModal();
      }
    }
  }
});
$exerciseDetailSection.addEventListener('click', (event) => {
  const $eventTarget = event.target;
  const $section = $eventTarget.closest('section.details');
  const exercise = findExerciseByBaseId(parseInt($section.dataset.baseId));
  if (
    $eventTarget.tagName === 'I' &&
    $eventTarget.classList.contains('fa-heart')
  ) {
    if (exercise) handleFavoriteClick(exercise, $eventTarget);
  } else if ($eventTarget.classList.contains('add-exercise-btn')) {
    renderAddExerciseForm();
    if (exercise) $addExerciseModal.showModal();
  }
});
$favoritesCta.addEventListener('click', () => {
  viewSwap('exercises-view');
});
$newWorkoutForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const $formElements = $newWorkoutForm.elements;
  // change days to array of day objects
  const numDays = parseInt($formElements.days.value);
  const dayObjArr = [];
  for (let i = 1; i <= numDays; i++) {
    const dayObject = {};
    dayObject[i] = [];
    dayObjArr.push(dayObject);
  }
  const newWorkout = {
    name: $formElements.name.value,
    days: dayObjArr,
    exercises: [],
    workoutId: fitlogData.nextWorkoutId,
  };
  console.log(newWorkout);
  fitlogData.nextWorkoutId++;
  fitlogData.workouts.push(newWorkout);
  $newWorkoutForm.reset();
  viewSwap('exercises-view');
  $workoutsSection.appendChild(renderWorkouts(newWorkout));
  createDragNDropEventListeners(newWorkout.workoutId);
  // Render the workout on the workouts-view
});
$addExerciseModal.addEventListener('click', (event) => {
  const $eventTarget = event.target;
  if ($eventTarget.classList.contains('fa-x')) {
    $addExerciseModal.close();
    while ($addExerciseForm.hasChildNodes()) {
      if ($addExerciseForm.firstChild) {
        $addExerciseForm.removeChild($addExerciseForm.firstChild);
      }
    }
  }
});
$addExerciseForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const selectedWorkoutIds = [];
  const checkboxes = $addExerciseForm.querySelectorAll(
    '#add-exercise-form input[type="checkbox"]:checked',
  );
  checkboxes.forEach((checkbox) => {
    const $checkbox = checkbox;
    selectedWorkoutIds.push(parseInt($checkbox.value));
  });
  const currentExercise = fitlogData.viewing;
  const selectedWorkouts = fitlogData.workouts.filter((workout) =>
    selectedWorkoutIds.includes(workout.workoutId),
  );
  selectedWorkouts.forEach((workout) => {
    workout.exercises.push(currentExercise);
  });
  $addExerciseForm.reset();
  $addExerciseModal.close();
  while ($addExerciseForm.hasChildNodes()) {
    if ($addExerciseForm.firstChild) {
      $addExerciseForm.removeChild($addExerciseForm.firstChild);
    }
  }
  renderAddedExercise(selectedWorkoutIds, currentExercise);
  // render the exercise list item
  // append it to the workout
  // Add exercises to exercises column in workout
});
