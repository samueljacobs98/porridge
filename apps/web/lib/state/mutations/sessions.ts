import {
  type MutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { createSession } from "@/lib/server/handlers/actions/create-session";
import { saveSession } from "@/lib/server/handlers/actions/save-session";
import type { SessionDTO } from "@/lib/types";
import { sessionsQueries } from "../queries";

export function useSaveSessionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveSession,
    onMutate: async (values) => {
      await queryClient.cancelQueries({
        queryKey: sessionsQueries.session(values.id).queryKey,
      });

      const previousSession = queryClient.getQueryData(
        sessionsQueries.session(values.id).queryKey
      );

      queryClient.setQueryData(sessionsQueries.session(values.id).queryKey, {
        ...(previousSession as SessionDTO),
        ...values,
      });

      return { previousSession };
    },
    onError: (error, values, context) => {
      console.error(error);
      queryClient.setQueryData(
        sessionsQueries.session(values.id).queryKey,
        context?.previousSession
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(sessionsQueries.metadata());
    },
  });
}

type CreateSessionParams = Parameters<typeof createSession>[0];

export function useCreateSessionMutation(
  options: Omit<
    MutationOptions<SessionDTO, Error, CreateSessionParams>,
    "mutationFn"
  > = {}
) {
  const { onSuccess, ...rest } = options;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSession,
    onSuccess: (...args) => {
      const [result] = args;
      queryClient.invalidateQueries(sessionsQueries.metadata());
      queryClient.setQueryData(
        sessionsQueries.session(result.id).queryKey,
        result
      );
      onSuccess?.(...args);
    },
    ...rest,
  });
}
