import {faker} from "@faker-js/faker";

function recommendationDataFactory() {
    return {
        "name": faker.lorem.lines(),
        "youtubeLink": faker.internet.url()
    }
}

export const recommendationFactories = {
    recommendationDataFactory
}