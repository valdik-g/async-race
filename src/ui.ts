import {
  drive, getCar, getCars, getWinners, startEngine, stopEngine,
} from './api';
import { getDistance, animation } from './utils';
import store from './store';

const renderCardImage = (color: string) => `
<?xml version="1.0" encoding="utf-8"?>
<svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 32 32" style="enable-background:new 0 0 32 32;" xml:space="preserve">
<g>
	<path style="fill:${color}" d="M27,17c-0.2,0-0.4,0-0.6,0.1l-0.6-1.9C26.2,15,26.6,15,27,15c0.7,0,1.4,0.1,2.1,0.3c0.5,0.2,1.1-0.1,1.3-0.6
		c0.2-0.5-0.1-1.1-0.6-1.3C28.9,13.1,27.9,13,27,13c-0.6,0-1.3,0.1-1.9,0.2l-2.2-6.5C22.8,6.3,22.4,6,22,6h-4c-0.6,0-1,0.4-1,1
		s0.4,1,1,1h3.3l0.7,2H17c-0.4,0-0.7,0.2-0.9,0.5l-0.4,0.6c-1.4,2.3-4,3.4-6.6,2.9c0,0,0,0,0,0c-1.2-0.6-2.7-1-4.1-1
		c-0.6,0-1,0.4-1,1s0.4,1,1,1c3.9,0,7,3.1,7,7c0,0.6,0.4,1,1,1h6c0.6,0,1-0.4,1-1c0-2.7,1.6-5.1,3.9-6.2l0.6,1.9
		C23,18.6,22,20.2,22,22c0,2.8,2.2,5,5,5s5-2.2,5-5S29.8,17,27,17z"/>
	<path style="fill:${color}" d="M5,17c-2.8,0-5,2.2-5,5s2.2,5,5,5s5-2.2,5-5S7.8,17,5,17z"/>
</g>
</svg>
`;

export const renderCar = ({
  id, name, color,
}: { id: number, name: string, color: string }): string => `
<div class="general-buttons">
<button class="button select-button" id="select-car-${id}">Select</button>
<button class="button remove-button" id="remove-car-${id}">Remove</button>
<span class="car-name">${name}</span>
</div>
<div class="road">
<div class="launch-pad">
<div class="control-panel">
<button class="icon start-button" id="start-car-${id}">A</button>
<button class="icon stop-button" id="stop-car-${id}" disabled>B</button>
</div>
<div class="car" id="car-${id}">
${renderCardImage(color)}
</div>
</div>
<div class="flag" id="flag-${id}">⚑</div>
</div>
`;

export const renderGarage = (): string => `
<h1>Garage(${store.carsCount})</h1>
<h1>Page #${store.carsPage}</h1>
<ul class="garage">
${store.cars.map((car: { id: number, name: string, color: string }) => `
<li>${renderCar(car)}</li>
`).join('')}
</ul>
`;

export const renderWinners = (): string => `
<h1>Winners(${store.winnersCount})</h1>
<h1>Page #${store.winnersPage}</h1>
<table class="table" cellspacing="0" border="0" cellpadding="0">
<thead>
<th>Number</th>
<th>Car</th>
<th>Name</th>
<th class="table-button table-wins ${(store.sortBy === 'wins') ? store.sortOrder : ''}" id="sort-by-wins">Wins</th>
<th class="table-button table-time ${(store.sortBy === 'time') ? store.sortOrder : ''}" id="sort-by-time">Best time</th>
</thead>
<tbody>
${store.winners.map((winner: { id: number, name: string, color: string, wins: number, time: number }, index: number) => `
<tr>
<td>${index + 1}</td>
<td>${renderCardImage(winner.color)}</td>
<td>${winner.name}</td>
<td>${winner.wins}</td>
<td>${winner.time}</td>
</tr>
`).join('')}
</tbody>
</table>
`;

export const render = async (): Promise<void> => {
  const html = `
<div class="menu">
<button class="button garage-menu-button" id="garage-menu">To garage</button>
<button class="button winners-menu-button" id="winners-menu">To winners</button>
</div>
<div id="garage-view">
<div>
<form class="form" id="create">
<input class="input" id="create-name" name="name" type="text">
<input class="color" id="create-color" name="color" type="color" value="#fff">
<button class="button" type="submit">Create</button>
</form>
<form class="form" id="update">
<input class="input" id="update-name" name="name" type="text" disabled>
<input class="color" id="update-color" name="color" type="color" value="#fff" disabled>
<button class="button" id="update-submit" type="submit" disabled >Update</button>
</form>
</div>
<div class="race-controls">
<button class="button race-button" id="race">Race</button>
<button class="button reset-button" id="reset" disabled>Reset</button>
<button class="button generator-button" id="generator">Generate cars</button>
</div>
<div id="garage">
${renderGarage()}
</div>
<div>
<p class="message" id="message"></p>
</div>
</div>
<div id="winners-view">
${renderWinners()}
</div>
<div class="pagination">
<button class="button prev-button" id="prev" disabled>Prev</button>
<button class="button next-button" id="next" disabled>Next</button>
</div>
`;
  const root = document.createElement('div');
  root.innerHTML = html;
  document.body.appendChild(root);
};

export const updateGarage = async (): Promise<void> => {
  const { items, count } = await getCars(store.carsPage);
  store.cars = items;
  store.carsCount = count;
  if (store.carsPage * 7 < Number(store.carsCount)) {
    (<HTMLInputElement>document.getElementById('next')).disabled = false;
  } else {
    (<HTMLInputElement>document.getElementById('next')).disabled = true;
  }
  if (store.carsPage > 1) {
    (<HTMLInputElement>document.getElementById('prev')).disabled = false;
  } else {
    (<HTMLInputElement>document.getElementById('prev')).disabled = true;
  }
};

export const updateWinners = async (): Promise<void> => {
  const { items, count } = await getWinners(store.winnersPage, store.sortBy, store.sortOrder);
  store.winners = items;
  store.winnersCount = count;
  if (store.winnersPage * 10 < Number(store.winnersCount)) {
    (<HTMLInputElement>document.getElementById('next')).disabled = false;
  } else {
    (<HTMLInputElement>document.getElementById('next')).disabled = true;
  }
  if (store.winnersPage > 1) {
    (<HTMLInputElement>document.getElementById('prev')).disabled = false;
  } else {
    (<HTMLInputElement>document.getElementById('prev')).disabled = true;
  }
};

export const startDriving = async (id: number): Promise<{
  id: number,
  success: boolean | Array<JSON>,
  time: number,
  color: string,
  name: string
}> => {
  (<HTMLInputElement>document.getElementById(`start-car-${id}`)).disabled = true;
  const { velocity, distance }: { velocity: number, distance: number } = await startEngine(id);
  const time = Math.round(distance / velocity);
  (<HTMLInputElement>document.getElementById(`stop-car-${id}`)).disabled = false;
  const car = document.getElementById(`car-${id}`) as HTMLElement;
  const flag = document.getElementById(`flag-${id}`) as HTMLElement;
  const htmlDistance = Math.floor(getDistance(car, flag)) + 65;
  const t: any = store.animation;
  t[id] = animation(car, htmlDistance, time);
  const success = await drive(id);
  const { color, name }: { color: string, name: string } = await getCar(id);
  if (!success.success) {
    window.cancelAnimationFrame(t[id].id);
  }
  return {
    id, success, time, color, name,
  };
};

export const stopDriving = async (id: number): Promise<void> => {
  (<HTMLInputElement>document.getElementById(`stop-car-${id}`)).disabled = true;
  await stopEngine(id);
  (<HTMLInputElement>document.getElementById(`start-car-${id}`)).disabled = false;
  (<HTMLElement>document.getElementById(`car-${id}`)).style.transform = 'translate(0px)';
  const t: any = store.animation;
  if (t[id]) window.cancelAnimationFrame(t[id].id);
};
export const setSortOrder = async (sort: string): Promise<void> => {
  let { sortOrder } = store;
  if (sortOrder === 'asc') {
    sortOrder = 'desc';
  } else {
    sortOrder = 'asc';
  }
  store.sortBy = sort;
  store.sortOrder = sortOrder;
  await updateWinners();
  (<HTMLElement>document.getElementById('winners-view')).innerHTML = renderWinners();
};
