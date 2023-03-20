import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "./../src/app.module";
import passport from "passport";
import session from "express-session";

describe("AppController (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(
      session({
        resave: false,
        saveUnintialized: false,
        secret: process.env.COOKIE_SECRET,
        cookie: {
          httpOnly: true,
        },
      })
    );

    app.use(passport.initialize());
    app.use(passport.session());
    await app.init();
  });

  it("/ (GET)", () => {
    return request(app.getHttpServer())
      .get("/")
      .expect(200)
      .expect("Hello World!");
  });

  it("회원가입 (POST)", () => {
    return request(app.getHttpServer())
      .post("/api/users")
      .send({ email: "test@test.com", nickname: "nickname", password: "1234" })
      .expect(201);
  });

  it("/user/login (POST)", () => {
    return request(app.getHttpServer())
      .post("/api/users/login")
      .send({ email: "test@test.com", password: "1234" })
      .expect(201);
  });
});
