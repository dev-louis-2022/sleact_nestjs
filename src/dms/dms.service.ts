import { Injectable } from "@nestjs/common";

@Injectable()
export class DmsService {
  getWorkspaceDMs(url: any, id: number) {
    throw new Error("Method not implemented.");
  }
  getWorkspaceDMChats(url: any, id: number, perPage: number, page: number) {
    throw new Error("Method not implemented.");
  }
  createWorkspaceDMChats(url: any, id: number, content: any, id1: number) {
    throw new Error("Method not implemented.");
  }
  createWorkspaceDMImages(
    url: any,
    files: Express.Multer.File[],
    id: number,
    id1: number
  ) {
    throw new Error("Method not implemented.");
  }
  getDMUnreadsCount(url: any, id: number, id1: number, after: number) {
    throw new Error("Method not implemented.");
  }
}
