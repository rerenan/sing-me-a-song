import { recommendationFactories } from './../factories/recommendationFactory';
import { prisma } from "../../src/database";
import dotenv from "dotenv";
import supertest from "supertest";
import app from '../../src/app';


dotenv.config();

console.log(`db:${process.env.DATABASE_URL}`)

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
  });
  
  afterAll(async () => {
    await prisma.$disconnect();
  });

describe("Test POST /recommendations",  () => {
    it("Should return status 201, if registered recommendation", async () => {
        const recommendation = recommendationFactories.recommendationDataFactory();

        const result = await supertest(app).post("/recommendations").send(recommendation)

        expect(result.status).toEqual(201)
    })
    it("Should return status 409, if recommendation already exists", async () => {
        const recommendation = recommendationFactories.recommendationDataFactory();

        await supertest(app).post("/recommendations").send(recommendation)

        const result = await supertest(app).post("/recommendations").send(recommendation)
        
        expect(result.status).toEqual(409)

    })
    it("Should return status 422, if send recommendation in format invalid", async () => {
        const recommendation = recommendationFactories.recommendationDataFactory();
        delete recommendation.name;

        const result = await supertest(app).post("/recommendations").send(recommendation)

        expect(result.status).toEqual(422)
    })
})

describe("Test GET /recommendations", () => {
    it("Should return status 200 and return recommendations",async () => {
        
        const result = await supertest(app).get("/recommendations")

        expect(result.status).toEqual(200);
        expect(result.body).not.toBeNull();
    })
})

describe("Test GET /recommendations/random", () => {
    it("Should return status 200 and return recommendation", async () => {
        const recommendation = recommendationFactories.recommendationDataFactory();

        await supertest(app).post("/recommendations").send(recommendation)

        const result = await supertest(app).get("/recommendations/random")
        
        expect(result.status).toEqual(200);
        expect(result.body).not.toBeNull();
    })
    it("Should return status 404 if recommendations not exists",async () => {
        const result = await supertest(app).get("/recommendations/random")
        
        expect(result.status).toEqual(404);
    })
})
    

describe("Test GET /recommendations/top/:amount", () => {
    it("Should return status 200 and return recommendations",async () => {
        const result = await supertest(app).get("/recommendations/top/1")

        expect(result.status).toEqual(200);
        expect(result.body).not.toBeNull();
    })
})

describe("Test GET /recommendations/:id", ()=>{
    it("Should return status 200 and return recommendations",async () => {
        const recommendation = recommendationFactories.recommendationDataFactory();

        await supertest(app).post("/recommendations").send(recommendation)

        const {body: recommendations} = await supertest(app).get("/recommendations")
        
        const result = await supertest(app).get(`/recommendations/${recommendations[0].id}`)

        expect(result.status).toEqual(200);
        expect(result.body).not.toBeNull();
    })
    it("Should return status 404 if recommendations not exists", async () => {
        const result = await supertest(app).get("/recommendations/1")

        expect(result.status).toEqual(404);
    })
})

describe("Test POST  /recommendations/:id/upvote", () => {
    it("Should return status 200 and add vote to recommendation",async () => {
        const recommendation = recommendationFactories.recommendationDataFactory();

        await supertest(app).post("/recommendations").send(recommendation)

        const {body: recommendations} = await supertest(app).get("/recommendations")

        const result = await supertest(app).post(`/recommendations/${recommendations[0].id}/upvote`)

        const updatedRecommendation = await supertest(app).get(`/recommendations/${recommendations[0].id}`)
        expect(result.status).toEqual(200);
        expect(updatedRecommendation.body.score).toEqual(recommendations[0].score + 1)

    })
    it("Should return status 404 if recommendations not exists", async () => {
        const result = await supertest(app).post("/recommendations/1/upvote")

        expect(result.status).toEqual(404);
    })
})

describe("Test GET /:id/downvote", () => {
    it("Should return status 200 and decrease vote to recommendation", async () => {
        const recommendation = recommendationFactories.recommendationDataFactory();

        await supertest(app).post("/recommendations").send(recommendation)

        const {body: recommendations} = await supertest(app).get("/recommendations")

        const result = await supertest(app).post(`/recommendations/${recommendations[0].id}/downvote`)

        const updatedRecommendation = await supertest(app).get(`/recommendations/${recommendations[0].id}`)
        expect(result.status).toEqual(200);
        expect(updatedRecommendation.body.score).toEqual(recommendations[0].score - 1)
    })
    it("Should return status 404 if recommendations not exists", async () =>{
        const result = await supertest(app).post("/recommendations/1/downvote")

        expect(result.status).toEqual(404);
    })
})

