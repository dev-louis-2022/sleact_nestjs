import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { HttpExceptionFilter } from "httpException.filter";
import passport from "passport";
import cookieParser from "cookie-parser";
import session from "express-session";
import fs from "fs";
import { NestExpressApplication } from "@nestjs/platform-express";
import path from "path";

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());

  if (process.env.NODE_ENV === "production") {
    app.enableCors({
      origin: ["https://sleact.nodebird.com"],
      credentials: true,
    });
  } else {
    app.enableCors({
      origin: true,
      credentials: true,
    });
  }

  app.useStaticAssets(path.join(__dirname, "..", "uploads"), {
    prefix: "/uploads",
  });

  app.use(cookieParser());
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

  const config = new DocumentBuilder()
    .setTitle("SLEACT API")
    .setDescription("슬리액트 개발 문서")
    .setVersion("1.0")
    .addTag("Sleact")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  new Logger().log(`Listening port ${port}`, "main.ts");

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  try {
    fs.readdirSync("uploads");
  } catch (error) {
    console.log("uploads 폴더 생성");
    fs.mkdirSync("uploads");
  }
}
bootstrap();
