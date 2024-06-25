interface Equipment {
  id: number;
  name: string;
}

interface Muscle {
  name: string;
  nameEn?: string;
  id?: number;
}

interface Exercise {
  name: string;
  image: string;
  baseId: number;
  id: number;
  description: string;
  primaryMuscles: Muscle[];
  secondaryMuscles: Muscle[];
  equipment: Equipment[];
  favorite: boolean;
}

// turn days into string of day objects

interface Day {
  [num: number]: Exercise[];
}

interface Workout {
  name: string;
  days: Day[];
  exercises: Exercise[];
  workoutId: number;
}

interface NewWorkoutFormElements extends HTMLFormControlsCollection {
  name: HTMLInputElement;
  days: HTMLSelectElement;
}

let exerciseObjArr: Exercise[] = [];

const $searchForm = document.querySelector('#search-form') as HTMLFormElement;
const $views = document.querySelectorAll('section');
const $beginBtn = document.querySelector('#begin');
const $exercisesCardList = document.querySelector(
  '#exercises-card-list',
) as HTMLDivElement;
const $header = document.querySelector('header');
const $hamburger = document.querySelector('.hamburger');
const $hamburgerLinks = document.querySelector('.hamburger-links');
const $noResults = document.querySelector('.no-results');
const $detailsTitle = document.querySelector(
  '.details-title',
) as HTMLHeadingElement;
const $detailsImg = document.querySelector('#details-img') as HTMLImageElement;
const $detailsMusclePrim = document.querySelector(
  '#details-muscle-prim',
) as HTMLSpanElement;
const $detailsMuscleSec = document.querySelector(
  '#details-muscle-sec',
) as HTMLSpanElement;
const $detailsEquipment = document.querySelector(
  '#details-equipment',
) as HTMLSpanElement;
const $detailsDescription = document.querySelector(
  '#details-description',
) as HTMLParagraphElement;
const $exerciseDetailSection = document.querySelector(
  '#details-section',
) as HTMLElement;
const $detailsHeart = document.querySelector(
  '.title-container > .fa-heart',
) as HTMLElement;
const $favoritesCardList = document.querySelector(
  '#favorites-card-list',
) as HTMLElement;
const $favoritesCta = document.querySelector(
  '#favorites-cta',
) as HTMLAnchorElement;
const $newWorkoutForm = document.querySelector(
  '.new-workout-form',
) as HTMLFormElement;
const $addExerciseBtn = document.querySelector(
  '.add-exercise-btn',
) as HTMLButtonElement;
const $addExerciseModal = document.querySelector(
  '.add-exercise-modal',
) as HTMLDialogElement;
const $addExerciseForm = document.querySelector(
  '#add-exercise-form',
) as HTMLFormElement;

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

function renderExercises(exerciseObj: Exercise): HTMLDivElement {
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

async function fetchExerciseDetails(
  baseId: number,
  id: number,
  img: string,
): Promise<Exercise> {
  const response = await fetch(
    `https://wger.de/api/v2/exercisebaseinfo/${baseId}/`,
  );
  if (!response.ok) {
    throw new Error(`HTTP Error: Status ${response.status}`);
  }
  const data = await response.json();
  const primaryMuscles: Muscle[] = [];
  const secondaryMuscles: Muscle[] = [];
  const equipment: Equipment[] = [];
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

async function fetchExerciseSearchData(term: string): Promise<void> {
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
        const exerciseObj: Exercise = await fetchExerciseDetails(
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

function viewSwap(view: string): void {
  for (let i = 0; i < $views.length; i++) {
    if ($views[i].dataset.view === view) {
      $views[i].classList.remove('hidden');
    } else {
      $views[i].classList.add('hidden');
    }
  }
}

function clearCardList(): void {
  while ($exercisesCardList.hasChildNodes()) {
    const child = $exercisesCardList.firstChild as Node;
    $exercisesCardList.removeChild(child);
  }
}

function findExerciseByBaseId(baseId: number): Exercise | null {
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

function handleFavoriteClick(
  exerciseObj: Exercise,
  targetIcon: HTMLElement,
): void {
  const $favoritesNodeList: NodeListOf<HTMLElement> = document.querySelectorAll(
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
      const nodeBaseId = $favoritesNodeList[i].dataset.baseId as string;
      if (parseInt(nodeBaseId) === exerciseObj.baseId) {
        $favoritesCardList.removeChild($favoritesNodeList[i]);
      }
    }
    if (fitlogData.favorites.length === 0)
      $favoritesCta.classList.remove('hidden');
  }
  const $exercisesNodeList: NodeListOf<HTMLElement> = document.querySelectorAll(
    '#exercises-card-list > .card',
  );
  if (!$exercisesNodeList) throw new Error('no exercise nodelist found');
  for (let i = 0; i < $exercisesNodeList.length; i++) {
    const nodeBaseId = $exercisesNodeList[i].dataset.baseId as string;
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

function populateExerciseDetails(exercise: Exercise): void {
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

function renderAddExerciseForm(): void {
  fitlogData.workouts.forEach((workout: Workout) => {
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
function renderWorkouts(workout: Workout): HTMLDivElement {
  const $workoutDiv = document.createElement('div');
  $workoutDiv.setAttribute('class', 'workout');
  $workoutDiv.setAttribute('data-workout-id', `${workout.workoutId}`);

  const $workoutTitleDiv = document.createElement('div');
  $workoutTitleDiv.setAttribute('class', 'workout-title flex');
  $workoutTitleDiv.setAttribute('style', 'gap: 10px');

  const $workoutTitleH1 = document.createElement('h1');
  $workoutTitleH1.textContent = workout.name;

  const $iconContainerDiv = document.createElement('div');
  $iconContainerDiv.setAttribute('class', 'flex align-center');

  const $icon = document.createElement('i');
  $icon.setAttribute('class', 'fa-solid fa-caret-right');

  $iconContainerDiv.appendChild($icon);
  $workoutTitleDiv.appendChild($workoutTitleH1);
  $workoutTitleDiv.appendChild($iconContainerDiv);

  const $daysContainerDiv = document.createElement('div');
  $daysContainerDiv.setAttribute('class', 'days-container flex wrap');
  $daysContainerDiv.setAttribute('style', 'gap: 20px');

  const $exercisesDiv = document.createElement('div');
  $exercisesDiv.setAttribute('class', 'exercises');

  const $exercisesH3 = document.createElement('h3');
  $exercisesH3.textContent = 'Exercises';

  const $exercisesUl = document.createElement('ul');
  workout.exercises.forEach((exercise: Exercise) => {
    const $exerciseLi = document.createElement('li');
    $exerciseLi.setAttribute('data-base-id', `${exercise.baseId}`);
    // make it draggable
    $exerciseLi.setAttribute('data-workout-id', `${workout.workoutId}`);
    $exerciseLi.setAttribute('draggable', 'true');
    $exerciseLi.textContent = exercise.name;
    $exercisesUl.appendChild($exerciseLi);
  });

  $exercisesDiv.appendChild($exercisesH3);
  $exercisesDiv.appendChild($exercisesUl);
  $daysContainerDiv.appendChild($exercisesDiv);

  for (let i = 1; i <= workout.days.length; i++) {
    const $dayDiv = document.createElement('div');
    $dayDiv.setAttribute('class', 'day');

    const $dayH3 = document.createElement('h3');
    $dayH3.textContent = `Day ${i}`;

    const $dayUl = document.createElement('ul');
    $dayUl.setAttribute('data-num-day', `${i}`);
    $dayUl.setAttribute('class', `target-${workout.workoutId}`);
    $dayUl.setAttribute('style', 'border: 1px solid black; height: 120px;');

    $dayDiv.appendChild($dayH3);
    $dayDiv.appendChild($dayUl);
    $daysContainerDiv.appendChild($dayDiv);
  }

  $workoutDiv.appendChild($workoutTitleDiv);
  $workoutDiv.appendChild($daysContainerDiv);

  return $workoutDiv;
}

// Example usage
const workout: Workout = {
  workoutId: 1,
  name: 'Workout render',
  days: [{ 1: [] }, { 2: [] }, { 3: [] }],
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

const $workoutsSection = document.querySelector('.workouts') as HTMLElement;
if (!$workoutsSection) throw new Error('no workouts section');

$workoutsSection.appendChild(renderWorkouts(workout));

// listen for click event on carat get the databaseWorkoutid

$workoutsSection.addEventListener('click', (event: Event) => {
  const $eventTarget = event.target as HTMLElement;
  console.log($eventTarget);
  if ($eventTarget.tagName === 'I') {
    const element = $eventTarget.closest('.workout') as HTMLDivElement;
    const workoutId = element.dataset.workoutId;
    const $exerciseNodeList = document.querySelectorAll(
      `li[data-workout-id="${workoutId}"]`,
    ) as NodeListOf<HTMLElement>;

    console.log('node list', $exerciseNodeList);
    $exerciseNodeList.forEach((element) => {
      element.addEventListener('dragstart', (event: DragEvent) => {
        console.log('dragging');
        if (event.dataTransfer) {
          event.dataTransfer.clearData();
          event.dataTransfer.setData('text/plain', element.dataset.baseId!);
        }
      });
    });
    const $dayNodeList = document.querySelectorAll(
      `.target-${workoutId}`,
    ) as NodeListOf<HTMLElement>;
    console.log('day node list', $dayNodeList);
    $dayNodeList.forEach((element) => {
      element.addEventListener('click', () => {
        console.log('target clicked');
      });
      element.addEventListener('dragover', (event1: DragEvent) => {
        event1.preventDefault();
        console.log('dragover');
      });

      element.addEventListener('drop', (event2: DragEvent) => {
        event2.preventDefault();
        if (event2.dataTransfer) {
          const data = event2.dataTransfer.getData('text');
          const source = document.querySelector(`[data-base-id="${data}"]`);
          if (source) {
            console.log(element);
            element?.appendChild(source);
          }

          console.log('target', event2.target);
        }
      });
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  fitlogData.favorites.forEach((exercise: Exercise) => {
    $favoritesCardList.appendChild(renderExercises(exercise));
  });
  if (fitlogData.favorites.length === 0)
    $favoritesCta.classList.remove('hidden');
});

$beginBtn.addEventListener('click', () => {
  viewSwap('exercises-view');
});

$searchForm.addEventListener('submit', (event: Event) => {
  event.preventDefault();
  clearCardList();
  const $exerciseSearch = document.querySelector(
    '#exercise-search',
  ) as HTMLInputElement;
  if (!$exerciseSearch) throw new Error('no exercise search input found');

  fetchExerciseSearchData($exerciseSearch.value);
  $searchForm.reset();
});

$header.addEventListener('click', (event: Event) => {
  const $eventTarget = event.target as HTMLDivElement;
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
  }
});

$exercisesCardList.addEventListener('click', (event: Event) => {
  const $eventTarget = event.target as HTMLElement;
  if ($eventTarget.closest('.card-list > .card')) {
    const $card = $eventTarget.closest('.card') as HTMLElement;
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

$favoritesCardList.addEventListener('click', (event: Event) => {
  const $eventTarget = event.target as HTMLElement;
  if ($eventTarget.closest('.card-list > .card')) {
    const $card = $eventTarget.closest('.card') as HTMLElement;
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

$exerciseDetailSection.addEventListener('click', (event: Event) => {
  const $eventTarget = event.target as HTMLElement;
  const $section = $eventTarget.closest('section.details') as HTMLElement;
  const exercise = findExerciseByBaseId(
    parseInt($section.dataset.baseId as string),
  );
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

$newWorkoutForm.addEventListener('submit', (event: Event) => {
  event.preventDefault();
  const $formElements = $newWorkoutForm.elements as NewWorkoutFormElements;
  // change days to array of day objects
  const numDays = parseInt($formElements.days.value);
  const dayObjArr = [];
  for (let i = 1; i <= numDays; i++) {
    const dayObject: Day = {};
    dayObject[i] = [];
    dayObjArr.push(dayObject);
  }

  const newWorkout: Workout = {
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
  // Render the workout on the workouts-view
});

$addExerciseModal.addEventListener('click', (event: Event) => {
  const $eventTarget = event.target as HTMLElement;
  if ($eventTarget.classList.contains('fa-x')) {
    $addExerciseModal.close();
    while ($addExerciseForm.hasChildNodes()) {
      if ($addExerciseForm.firstChild) {
        $addExerciseForm.removeChild($addExerciseForm.firstChild);
      }
    }
  }
});

$addExerciseForm.addEventListener('submit', (event: Event): void => {
  event.preventDefault();
  const selectedWorkoutIds: number[] = [];
  const checkboxes = $addExerciseForm.querySelectorAll(
    '#add-exercise-form input[type="checkbox"]:checked',
  );
  checkboxes.forEach((checkbox) => {
    const $checkbox = checkbox as HTMLInputElement;
    selectedWorkoutIds.push(parseInt($checkbox.value));
  });
  const currentExercise = fitlogData.viewing as Exercise;

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
});

fitlogData.workouts = [];
