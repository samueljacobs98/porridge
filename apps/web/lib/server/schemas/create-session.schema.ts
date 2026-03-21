import { SessionMapper } from "../domain/mappers/session.mapper";
import { SessionSchema } from "../domain/schemas/session.schema";

export const createSessionSchema = SessionSchema.createDtoSchema.transform(
  SessionMapper.fromParsedCreateDto
);
