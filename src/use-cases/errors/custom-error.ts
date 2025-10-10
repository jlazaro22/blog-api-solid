export class CustomError extends Error {
  private response: { httpCode: number; code: string; message: string };

  constructor(response: { httpCode: number; code: string; message: string }) {
    super(response.message);
    this.response = response;
  }

  public getResponse(): { httpCode: number; code: string; message: string } {
    return this.response;
  }
}
