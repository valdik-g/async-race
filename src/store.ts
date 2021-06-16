import { getCars, getWinners } from './api';

const { items: cars, count: carsCount } = await getCars(1);
const { items: winners, count: winnersCount } = await getWinners(1, '', '');

export default {
  carsPage: 1,
  cars,
  carsCount,
  winnersPage: 1,
  winners,
  winnersCount,
  sortBy: '',
  sortOrder: '',
  animation: {},
  view: 'garage',
};
