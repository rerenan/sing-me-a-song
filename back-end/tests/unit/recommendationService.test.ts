import { recommendationFactories } from './../factories/recommendationFactory';
import { jest } from '@jest/globals';
import { recommendationService } from '../../src/services/recommendationsService';
import { recommendationRepository } from '../../src/repositories/recommendationRepository';

beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
});

describe("Unit test for recommendation service", () =>{
    it("Should create a recommendation", async () =>{
        const recomendation = recommendationFactories.recommendationDataFactory();

        jest
        .spyOn(recommendationRepository, "findByName")
        .mockImplementationOnce((): any => {
          return false;
        });
  
        jest
        .spyOn(recommendationRepository, "create")
        .mockImplementationOnce((): any => {});
        
        await recommendationService.insert(recomendation);
  
        expect(recommendationRepository.findByName).toBeCalled();
        expect(recommendationRepository.create).toBeCalled();
    })
    it("Should not create a duplicated recommendation", async () =>{
        const recomendation = recommendationFactories.recommendationDataFactory();
        
        jest
        .spyOn(recommendationRepository, "findByName")
        .mockImplementationOnce((): any => {
            return recomendation
        });
        
        const promise = recommendationService.insert(recomendation);

        expect(promise).rejects.toEqual({ 
            type: "conflict", 
            message: "Recommendations names must be unique"
        });

        expect(recommendationRepository.findByName).toBeCalled();
        expect(recommendationRepository.create).not.toBeCalled();
    })

    it("Should get recommendation by id", async () => {
        const id = recommendationFactories.idFactory();
        const recomendation = recommendationFactories.recommendationDataFactory(); 
        
        jest
        .spyOn(recommendationRepository, "find")
        .mockImplementationOnce((): any => {
            return recomendation
        });

        const result = await recommendationService.getById(id);

        expect(recommendationRepository.find).toBeCalled();
        expect(result).toEqual(recomendation);
    })
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