const brand = ['Audi', 'Bentley', ' Bugatti', 'Cadillac', 'Dodge', 'Ferrari', 'Jaguar', 'Lamborghini', 'Mclaren', 'Pagani'];

const models = ['R8 V10', 'Model S', 'Zonda F', 'Carrera GT', 'MP40', 'XFR', 'XK120', 'Challenger', 'Aventador', 'F40'];

const CreateCount = 100;

const createRandomName = () => {
  const name = brand[Math.floor(Math.random() * brand.length)];
  const model = models[Math.floor(Math.random() * models.length)];
  return `${name} ${model}`;
};

const createRandomColor = () => `#${(`${Math.random().toString(16)}000000`).substring(2, 8).toUpperCase()}`;

export const createRandomCars = () => new Array(CreateCount).fill(1)
  .map(() => ({ name: createRandomName(), color: createRandomColor() }));
