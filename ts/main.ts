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
  image?: string;
  baseId?: number;
  id?: number;
  description?: string;
  primaryMuscles?: Muscle[];
  secondaryMuscles?: Muscle[];
  equipment?: Equipment;
}

const rootURL = 'https://wger.de/api/v2';
console.log(rootURL);

const $searchForm = document.querySelector('#search-form') as HTMLFormElement;
const $views = document.querySelectorAll('section');
const $beginBtn = document.querySelector('#begin');

if (!$searchForm) throw new Error('no search form found');
if (!$views) throw new Error('no views found');
if (!$beginBtn) throw new Error('no begin button found');

// function renderExercises(exerciseObj: Exercise): void {}

async function fetchExerciseDetails(
  baseId: number,
  id: number,
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
  let exerciseName = '';
  let exerciseDescription = '';
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
  const exerciseObj: Exercise = {
    name: exerciseName,
    description: exerciseDescription,
    primaryMuscles,
    secondaryMuscles,
    baseId,
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
    const exerciseObjArr: Exercise[] = [];
    for (let i = 0; i < data.suggestions.length; i++) {
      if (data.suggestions[i].data.image !== null) {
        const exerciseObj: Exercise = await fetchExerciseDetails(
          data.suggestions[i].data.base_id,
          data.suggestions[i].data.id,
        );
        exerciseObj.id = data.suggestions[i].data.id;
        exerciseObj.image = 'https://wger.de' + data.suggestions[i].data.image;
        exerciseObjArr.push(exerciseObj);
      }
    }

    console.log(exerciseObjArr[0]);
  } catch (error) {
    console.log(error);
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

$beginBtn.addEventListener('click', () => {
  viewSwap('exercises-view');
});

$searchForm.addEventListener('submit', (event: Event) => {
  event.preventDefault();
  const $exerciseSearch = document.querySelector(
    '#exercise-search',
  ) as HTMLInputElement;
  if (!$exerciseSearch) throw new Error('no exercise search input found');

  fetchExerciseSearchData($exerciseSearch.value);
  $searchForm.reset();
});
