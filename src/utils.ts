import store from './store';

function getPositionAtCenter(elem: HTMLElement): { x: number, y: number } {
  const {
    top, left, width, height,
  } = elem.getBoundingClientRect();
  return {
    x: left + width / 2,
    y: top + height / 2,
  };
}

export function getDistance(a: HTMLElement, b: HTMLElement): number {
  const aPos = getPositionAtCenter(a);
  const bPos = getPositionAtCenter(b);
  return Math.hypot(aPos.x - bPos.x, aPos.y - bPos.y);
}

export function animation(car: HTMLElement, distance: number, animationTime: number)
  : { id: number } {
  let start = NaN;
  const state: { id: number } = { id: 0 };
  function step(timestamp: number) {
    if (!start) {
      start = timestamp;
    }
    const time = timestamp - start;
    const passed = Math.round(time * (distance / animationTime));
    car.style.transform = `translateX(${Math.min(passed, distance)}px)`;
    if (passed < distance) {
      state.id = window.requestAnimationFrame(step);
    }
  }
  state.id = window.requestAnimationFrame(step);
  return state;
}

export const raceAll = async (promises: any, ids: Array<number>):
Promise<{ time: number, id: number, name: string, color: string, wins: number }> => {
  const { success, id, time } = await Promise.race(promises);
  if (!success.success) {
    const failedIndex = ids.findIndex((i: number) => i === id);
    const restPromises = [...promises.slice(0, failedIndex),
      ...promises.slice(failedIndex + 1, promises.length)];
    const restIds = [...ids.slice(0, failedIndex), ...ids.slice(failedIndex + 1, ids.length)];
    return raceAll(restPromises, restIds);
  }
  return {
    ...store.cars.find((car: { id: number })
    => car.id === id),
    time: +(time / 1000).toFixed(2),
  };
};

export const race = async (action: any):
Promise<{ id: number, time: number, name: string, color: string, wins: number }> => {
  const promises = store.cars.map(({ id }: { id: number }) => action(id));
  const winner = await raceAll(promises, store.cars.map((car: any) => (car.id)));
  return winner;
};
