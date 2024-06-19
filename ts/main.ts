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
  equipment?: Equipment;
}

const $searchForm = document.querySelector('#search-form') as HTMLFormElement;
const $views = document.querySelectorAll('section');
const $beginBtn = document.querySelector('#begin');
const $cardList = document.querySelector('.card-list') as HTMLDivElement;
const $header = document.querySelector('header');
const $hamburger = document.querySelector('.hamburger');
const $hamburgerLinks = document.querySelector('.hamburger-links');
const $noResults = document.querySelector('.no-results');

if (!$searchForm) throw new Error('no search form found');
if (!$views) throw new Error('no views found');
if (!$beginBtn) throw new Error('no begin button found');
if (!$cardList) throw new Error('no card list found');
if (!$header) throw new Error('no header found');
if (!$noResults) throw new Error('no results not found');

function renderExercises(exerciseObj: Exercise): HTMLDivElement {
  const $card = document.createElement('div');
  $card.setAttribute('class', 'card flex');

  const $cardImg = document.createElement('img');
  $cardImg.setAttribute('src', exerciseObj.image);
  $cardImg.setAttribute('class', 'card-img');

  const $cardText = document.createElement('div');
  $cardText.setAttribute('class', 'card-text');
  const $cardTitle = document.createElement('h3');
  $cardTitle.textContent = exerciseObj.name;
  const $cardCaption = document.createElement('p');
  $cardCaption.innerHTML = exerciseObj.description;

  $cardText.appendChild($cardTitle);
  $cardText.appendChild($cardCaption);
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
  const exerciseObj = {
    name: exerciseName,
    description: exerciseDescription,
    primaryMuscles,
    secondaryMuscles,
    baseId,
    image: img,
    id,
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
          'https://wger.de' + data.suggestions[i].data.image,
        );
        exerciseObjArr.push(exerciseObj);
      }
    }
    if (exerciseObjArr.length > 0) {
      exerciseObjArr.forEach((element) => {
        $cardList.appendChild(renderExercises(element));
      });
      $noResults?.classList.add('hidden');
    } else {
      $noResults?.classList.remove('hidden');
    }
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

function clearCardList(): void {
  while ($cardList.hasChildNodes()) {
    const child = $cardList.firstChild as Node;
    $cardList.removeChild(child);
  }
}

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
  }
});
