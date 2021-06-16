import {
  createCar, deleteCar, deleteWinner, getCar, getWinnerStatus, saveWinner, updateCar,
} from './api';
import store from './store';
import {
  renderGarage, renderWinners, setSortOrder, startDriving, stopDriving, updateGarage, updateWinners,
} from './ui';
import { race } from './utils';
import { createRandomCars } from './create-random';

let ids: number;
export const listen = (): void => {
  document.body.addEventListener('click', async (event) => {
    const target = event.target as Element;
    if (target.id === 'winners-menu') {
      store.view = 'winners';
      (<HTMLElement>document.getElementById('winners-view')).style.display = 'block';
      (<HTMLElement>document.getElementById('garage-view')).style.display = 'none';
      await updateWinners();
      (<HTMLElement>document.getElementById('winners-view')).innerHTML = renderWinners();
    }
    if (target.id === 'garage-menu') {
      store.view = 'garage';
      (<HTMLElement>document.getElementById('winners-view')).style.display = 'none';
      (<HTMLElement>document.getElementById('garage-view')).style.display = 'block';
    }
    if (target.classList.contains('remove-button')) {
      const idd = (target.id).split('-')[2];
      await deleteCar(+idd);
      if (await getWinnerStatus(+idd) !== 404) {
        await deleteWinner(+idd);
      }
      await updateGarage();
      await updateWinners();
      (<HTMLElement>document.getElementById('garage')).innerHTML = renderGarage();
    }
    if (target.classList.contains('select-button')) {
      ids = +((target.id).split('-')[2]);
      const selected: { name: string, color: string } = await getCar(+(target.id).split('-')[2]);
      (<HTMLInputElement>document.getElementById('update-name')).value = selected.name;
      (<HTMLInputElement>document.getElementById('update-color')).value = selected.color;
      (<HTMLInputElement>document.getElementById('update-name')).disabled = false;
      (<HTMLInputElement>document.getElementById('update-color')).disabled = false;
      (<HTMLInputElement>document.getElementById('update-submit')).disabled = false;
    }
    if (target.classList.contains('race-button')) {
      const targ = event.target as HTMLInputElement;
      targ.disabled = true;
      // eslint-disable-next-line max-len
      const winner: { id: number, time: number, name: string, color: string, wins: number } = await race(startDriving);
      await saveWinner(winner);
      const message = document.getElementById('message');
      (<HTMLElement>message).innerHTML = `${winner.name} : ${winner.time} sec`;
      (<HTMLElement>message).style.display = 'block';
      setTimeout(() => {
        (<HTMLElement>message).style.display = 'none';
      }, 5000);
      (<HTMLInputElement>document.getElementById('reset')).disabled = false;
    }
    if (target.classList.contains('reset-button')) {
      const targ = event.target as HTMLInputElement;
      targ.disabled = true;
      store.cars.map(({ id }: { id: number }) => stopDriving(id));
      (<HTMLInputElement>document.getElementById('race')).disabled = false;
    }
    if (target.classList.contains('next-button')) {
      if (store.view === 'garage') {
        store.carsPage++;
        await updateGarage();
        (<HTMLElement>document.getElementById('garage')).innerHTML = renderGarage();
      } else {
        store.winnersPage++;
        await updateWinners();
        (<HTMLElement>document.getElementById('winners-view')).innerHTML = renderWinners();
      }
    }
    if (target.classList.contains('prev-button')) {
      if (store.view === 'garage') {
        store.carsPage--;
        await updateGarage();
        (<HTMLElement>document.getElementById('garage')).innerHTML = renderGarage();
      } else {
        store.winnersPage--;
        await updateWinners();
        (<HTMLElement>document.getElementById('winners-view')).innerHTML = renderWinners();
      }
    }
    if (target.classList.contains('start-button')) {
      const id = +(target.id.split('start-car-')[1]);
      startDriving(id);
    }
    if (target.classList.contains('stop-button')) {
      const id = +(target.id.split('stop-car-')[1]);
      stopDriving(id);
    }
    if (target.classList.contains('generator-button')) {
      const targ = event.target as HTMLInputElement;
      targ.disabled = true;
      const cars = createRandomCars();
      await Promise.all(cars.map(async (c) => createCar(c)));
      await updateGarage();
      (<HTMLElement>document.getElementById('garage')).innerHTML = renderGarage();
      targ.disabled = false;
    }
    if (target.classList.contains('table-wins')) {
      setSortOrder('wins');
    }
    if (target.classList.contains('table-time')) {
      setSortOrder('time');
    }
  });
  document.body.addEventListener('submit', async (event) => {
    const target = event.target as Element;
    event.preventDefault();
    if (target.id === 'create') {
      const name = (<HTMLInputElement>document.getElementById('create-name')).value;
      const color = (<HTMLInputElement>document.getElementById('create-color')).value;
      await createCar({ name, color });
      await updateGarage();
      (<HTMLElement>document.getElementById('garage')).innerHTML = renderGarage();
      (<HTMLInputElement>document.getElementById('create-name')).value = '';
      (<HTMLInputElement>document.getElementById('create-color')).value = '#000000';
    }
    if (target.id === 'update') {
      const name = (<HTMLInputElement>document.getElementById('update-name')).value;
      const color = (<HTMLInputElement>document.getElementById('update-color')).value;
      await updateCar(ids, { name, color });
      await updateGarage();
      (<HTMLElement>document.getElementById('garage')).innerHTML = renderGarage();
      (<HTMLInputElement>document.getElementById('update-name')).value = '';
      (<HTMLInputElement>document.getElementById('update-color')).value = '#000000';
      (<HTMLInputElement>document.getElementById('update-name')).disabled = true;
      (<HTMLInputElement>document.getElementById('update-color')).disabled = true;
      (<HTMLInputElement>document.getElementById('update-submit')).disabled = true;
    }
  });
};
