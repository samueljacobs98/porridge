import { SessionMapper } from "../domain/mappers/session.mapper";
import { SessionSchema } from "../domain/schemas/session.schema";

export const saveSessionSchema = SessionSchema.dtoSchema.transform(
  SessionMapper.fromParsedDTO
);
