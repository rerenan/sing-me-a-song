import { jest } from '@jest/globals';

beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
});

describe("Unit test for recommendation service", () =>{
    it.todo("Should create a recommendation")
    it.todo("Should not create a duplicated recommendation")
    it.todo("Should get recommendation by id")
    it.todo("Should get all recommendations")
    it.todo("Should get an amount recommendations ranked by votes")
    it.todo("Should add an upvote on the recommendation")
    it.todo("Should decrement an upvote on the recommendation")
    it.todo("Should get random recommendation")
    it.todo("Should remove recommendation if votes are less -5")
    it.todo("Should return gt if random params is less than 7")
    it.todo("Should return lte if random params is greater than 7")
    it.todo("Should return recomendation by score if recommendation length is greater than 0")
    it.todo("Should return all recomendation if recommendation length is 0")
})