import { fstFromTransitionFn } from '@cow-sunday/fp-ts';
import {
  Matchmaker,
  MatchmakerInput,
  MatchmakerOutput,
  findMatch,
  leaveMatchmaking,
  leftMatchmaking,
  matchMade,
  playerInMatchmakingQueue,
} from '../protocol';

export function createMatchmakerFifo(capacity: number): Matchmaker {
  const fst = fstFromTransitionFn(transition, initialState());

  return fst;
}

export type State = {
  playerWaitingId: string | undefined;
};
export function initialState(): State {
  return {
    playerWaitingId: undefined,
  };
}
export function transition(
  state: State,
  input: MatchmakerInput,
): [State, Array<MatchmakerOutput>] {
  switch (input.kind) {
    case findMatch.kind:
      if (state.playerWaitingId === undefined) {
        return [
          { playerWaitingId: input.value.playerId },
          [playerInMatchmakingQueue({ playerId: input.value.playerId })],
        ];
      } else if (state.playerWaitingId !== input.value.playerId) {
        return [
          initialState(),
          [
            matchMade({
              player1Id: state.playerWaitingId,
              player2Id: input.value.playerId,
            }),
          ],
        ];
      } else {
        return [state, []];
      }
    case leaveMatchmaking.kind:
      if (state.playerWaitingId === input.value.playerId) {
        return [
          initialState(),
          [leftMatchmaking({ playerId: state.playerWaitingId })],
        ];
      } else {
        return [state, []];
      }
  }
}
