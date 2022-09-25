import {faker} from "@faker-js/faker";

function recommendationDataFactory() {
    return {
        "name": faker.lorem.lines(),
        "youtubeLink": faker.internet.url()
    }
}
function recomendationArrayFactory() {
    const randNumber = faker.datatype.number({max: 20});
    const recomendationArray = [];
    for(let i = 0; i < randNumber; i++){
        recomendationArray.push(recommendationDataFactory);
    };

    return recomendationArray;
}

function idFactory() {
    return faker.datatype.number();
}

export const recommendationFactories = {
    recommendationDataFactory,
    recomendationArrayFactory,
    idFactory,
}