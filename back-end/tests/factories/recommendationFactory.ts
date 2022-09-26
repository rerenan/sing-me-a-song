import { faker } from "@faker-js/faker";

function recommendationDataFactory() {
  return {
    name: faker.lorem.words(),
    youtubeLink: `https://www.youtube.com/watch?v=${faker.datatype.string(10)}`,
  };
}
function updatedRecommendationDataFactory() {
  return {
    name: faker.lorem.lines(),
    youtubeLink: faker.internet.url(),
    score: faker.datatype.number({ max: 1000 }),
  };
}

function hatedRecommendationDataFactory() {
  return {
    name: faker.lorem.lines(),
    youtubeLink: faker.internet.url(),
    score: -1 * faker.datatype.number({ min: 4 }),
  };
}

async function recommendationArrayFactory() {
  const randNumber = faker.datatype.number({ max: 20 });
  const recomendationArray = [];
  for (let i = 0; i < randNumber; i++) {
    recomendationArray.push(recommendationDataFactory);
  }

  return recomendationArray;
}

function numberFactory() {
  return faker.datatype.number();
}

function floatLessSevenFactory() {
  return faker.datatype.float({ max: 0.7 });
}

function scoreFilterFactory() {
  return faker.helpers.arrayElement<"gt" | "lte">(["gt", "lte"]);
}

export const recommendationFactories = {
  recommendationDataFactory,
  recommendationArrayFactory,
  numberFactory,
  updatedRecommendationDataFactory,
  hatedRecommendationDataFactory,
  floatLessSevenFactory,
  scoreFilterFactory,
};
