import { prisma } from "../../src/database";
import dotenv from "dotenv";
import supertest from "supertest";


dotenv.config();

console.log(`db:${process.env.DATABASE_URL}`)

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE users`;
  });
  
  afterAll(async () => {
    await prisma.$disconnect();
  });

describe("Test POST /",() => {
    it.todo("Should return status 201, if registered recommendation")
    it.todo("Should return status 422, if send recommendation in format invalid")
    it.todo("Should return status 409, if recommendation already exists")
})

describe("Test GET /", () => {
    it.todo("Should return status 200 and return recommendations")
})

describe("Test GET /random", () => {
    it.todo("Should return status 200 and return recommendations")
    it.todo("Should return status 404 if recommendations not exists")
})

describe("Test GET /top/amount", () => {
    it.todo("Should return status 200 and return recommendations")
})

describe("Test GET /:id", ()=>{
    it.todo("Should return status 200 and return recommendations")
    it.todo("Should return status 404 if recommendations not exists")
})

describe("Test GET /:id/upvote", () => {
    it.todo("Should return status 200 and add vote to recommendation")
    it.todo("Should return status 404 if recommendations not exists")
})

describe("Test GET /:id/downvote", () => {
    it.todo("Should return status 200 and decrease vote to recommendation")
    it.todo("Should return status 404 if recommendations not exists")
})

