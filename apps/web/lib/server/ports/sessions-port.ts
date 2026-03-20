import type {
  SessionContentDTO,
  SessionDTO,
  SessionMetadataDTO,
} from "@/lib/types";

export interface SessionsPort {
  getSessionsMetadata: () => Promise<SessionMetadataDTO[]>;
  getSession: (sessionId: string) => Promise<SessionDTO>;
  saveSession: (sessionId: string, content: SessionContentDTO) => Promise<void>;
}
