import { recommendationFactories } from './../factories/recommendationFactory';
import { jest } from '@jest/globals';
import { recommendationService } from '../../src/services/recommendationsService';
import { recommendationRepository } from '../../src/repositories/recommendationRepository';

beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
});

describe("Unit test for recommendation service", () => {

    it("Should create a recommendation", async () => {
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

    it("Should not create a duplicated recommendation", async () => {
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
        const id = recommendationFactories.numberFactory();
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
    it("Should return not found error if recommendation not exists", async () => {
        const id = recommendationFactories.numberFactory();
        
        jest
        .spyOn(recommendationRepository, "find")
        .mockImplementationOnce((): any => {
        });

        const promise = recommendationService.getById(id);

        expect(promise).rejects.toEqual({ 
            type: "not_found", 
            message: ""
        });
        expect(recommendationRepository.find).toBeCalled();
    })

    it("Should get all recommendations", async () => {
        const recomendationArray = await recommendationFactories.recommendationArrayFactory();

        jest
        .spyOn(recommendationRepository, "findAll")
        .mockImplementationOnce((): any => {
            return recomendationArray
        });

        const result = await recommendationService.get();

        expect(recommendationRepository.findAll).toBeCalled();
        expect(result).toEqual(recomendationArray);
    })

    it("Should get an amount recommendations ranked by votes", async () =>{

        const amount = recommendationFactories.numberFactory();

        jest
        .spyOn(recommendationRepository, "getAmountByScore")
        .mockImplementationOnce((): any => {});

        await recommendationService.getTop(amount);

        expect(recommendationRepository.getAmountByScore).toBeCalled();
    })

    it("Should add an upvote on the recommendation",async () => {
        const id = recommendationFactories.numberFactory();
        const recommendation = recommendationFactories.recommendationDataFactory();

        jest
        .spyOn(recommendationRepository, "updateScore")
        .mockImplementationOnce((): any => {});
 
        jest
        .spyOn(recommendationRepository, "find")
        .mockImplementationOnce((): any => {
            return recommendation
        });

        await recommendationService.upvote(id);

        expect(recommendationRepository.find).toBeCalled();
        expect(recommendationRepository.updateScore).toBeCalled();
    })

    it("Should not add upvote to recommendation that does not exist", async () => {
        const id = recommendationFactories.numberFactory();
 
        jest
        .spyOn(recommendationRepository, "find")
        .mockImplementationOnce((): any => {
            return false;
        });

        const promise = recommendationService.upvote(id);

        expect(promise).rejects.toEqual({ 
            type: "not_found", 
            message: ""
        });

        expect(recommendationRepository.find).toBeCalled();
    })

    it("Should decrease recommendation vote", async () => {
        
        const id = recommendationFactories.numberFactory();
        const recommendation = recommendationFactories.recommendationDataFactory();
        const updatedRecomendation = recommendationFactories.updatedRecommendationDataFactory();
        
        jest
        .spyOn(recommendationRepository, "updateScore")
        .mockImplementationOnce((): any => {
            return updatedRecomendation
        });
 
        jest
        .spyOn(recommendationRepository, "find")
        .mockImplementationOnce((): any => {
            return recommendation
        });

         await recommendationService.downvote(id);

        expect(recommendationRepository.find).toBeCalled();
        expect(recommendationRepository.updateScore).toBeCalled();
    });

    it("Should remove recommendation if votes are less -5",async () => {
        const id = recommendationFactories.numberFactory();
        const recommendation = recommendationFactories.recommendationDataFactory();
        const updatedRecomendation = recommendationFactories.hatedRecommendationDataFactory();
        
        jest
        .spyOn(recommendationRepository, "updateScore")
        .mockImplementationOnce((): any => {
            return updatedRecomendation
        });
 
        jest
        .spyOn(recommendationRepository, "find")
        .mockImplementationOnce((): any => {
            return recommendation
        });

        jest
        .spyOn(recommendationRepository, "remove")
        .mockImplementationOnce((): any => {});

        await recommendationService.downvote(id);

        expect(recommendationRepository.find).toBeCalled();
        expect(recommendationRepository.updateScore).toBeCalled();
        expect(recommendationRepository.remove).toBeCalled();
    })

    it("Should get random recommendation",async () => {
        const recommendationArray = await recommendationFactories.recommendationArrayFactory();

        jest
        .spyOn(recommendationRepository, "findAll")
        .mockImplementationOnce((): any => {
            return recommendationArray
        });

        const result = await recommendationService.getRandom();

        expect(recommendationRepository.findAll).toBeCalled();
        expect(recommendationArray).toContain(result);
    })

    it("Should not get random recommendation if not have recommendation ",async () => {
    
        jest
        .spyOn(recommendationRepository, "findAll")
        .mockImplementationOnce((): any => {
            return [];
        })
        .mockImplementationOnce((): any => {
            return [];
        })

        const promise = recommendationService.getRandom();
        
        expect(promise).rejects.toEqual({ 
            type: "not_found", 
            message: ""
        });
        expect(recommendationRepository.findAll).toBeCalled();
    })
  
    it("Should return gt if random params is less than 7 ", async () => {
        const number = recommendationFactories.floatLessSevenFactory();

        const result = recommendationService.getScoreFilter(number);

        expect(result).toEqual("gt");
    })
    it("return lte if random params is greater than 7" , async () => {
        const number = recommendationFactories.floatLessSevenFactory() + 0.7
       
        const result = recommendationService.getScoreFilter(number);
        
        expect(result).toEqual("lte");
    })
    it("Should return recomendation by score if recommendation length is greater than 0", async () => {
        const scoreFilter = recommendationFactories.scoreFilterFactory();

        const recommendationArray = await recommendationFactories.recommendationArrayFactory();

        jest
        .spyOn(recommendationRepository, "findAll")
        .mockImplementationOnce((): any => {
            return recommendationArray
        });

        const result = await recommendationService.getByScore(scoreFilter);

        expect(result).toEqual(recommendationArray);
        expect(recommendationRepository.findAll).toBeCalled();
    })
    it("Should return all recomendation if recommendation length is 0",async () => {
        const scoreFilter = recommendationFactories.scoreFilterFactory();
        const recommendationArray = await recommendationFactories.recommendationArrayFactory();
        jest
        .spyOn(recommendationRepository, "findAll")
        .mockImplementationOnce((): any => {
            return [];
        })
        .mockImplementationOnce((): any => {
            return recommendationArray
        });
        
        const result = await recommendationService.getByScore(scoreFilter);
        
        expect(result).toEqual(recommendationArray);
        expect(recommendationRepository.findAll).toBeCalledTimes(2);
    })
})