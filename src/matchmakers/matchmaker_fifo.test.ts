import {
  STATE_IS_UNCHANGED,
  createFstTester,
  fstFromTransitionFn,
} from '@cow-sunday/fp-ts';
import { State, initialState, transition } from './matchmaker_fifo';
import {
  MatchmakerOutput,
  findMatch,
  leaveMatchmaking,
  leftMatchmaking,
  matchMade,
  playerInMatchmakingQueue,
} from '../protocol';
import assert from 'node:assert';
import test, { describe } from 'node:test';

const fstFactory = (state?: State) =>
  fstFromTransitionFn(transition, state ? state : initialState());
const assertStatesEqual = (e: State, a: State) => {
  assert.deepStrictEqual(a, e);
};
const assertOutputsEqual = (
  e: Array<MatchmakerOutput>,
  a: Array<MatchmakerOutput>,
) => {
  assert.deepStrictEqual(a, e);
};

const fstTest = createFstTester(
  fstFactory,
  assertStatesEqual,
  assertOutputsEqual,
);

export const matchmakerFifoTestCases = () => [
  {
    description: 'findMatch, nobody queued',
    test: fstTest({
      Given: initialState(),
      When: findMatch({ playerId: 'p1' }),
      Then: { playerWaitingId: 'p1' },
      And: [playerInMatchmakingQueue({ playerId: 'p1' })],
    }),
  },
  {
    description: 'findMatch, another player waiting',
    test: fstTest({
      Given: { playerWaitingId: 'p1' },
      When: findMatch({ playerId: 'p2' }),
      Then: initialState(),
      And: [matchMade({ player1Id: 'p1', player2Id: 'p2' })],
    }),
  },
  {
    description: 'findMatch, same player waiting',
    test: fstTest({
      Given: { playerWaitingId: 'p1' },
      When: findMatch({ playerId: 'p1' }),
      Then: STATE_IS_UNCHANGED,
      And: [],
    }),
  },
  {
    description: 'leaveMatchmaking, same player queued',
    test: fstTest({
      Given: { playerWaitingId: 'p1' },
      When: leaveMatchmaking({ playerId: 'p1' }),
      Then: initialState(),
      And: [leftMatchmaking({ playerId: 'p1' })],
    }),
  },
  {
    description: 'leaveMatchmaking, nobody queued',
    test: fstTest({
      Given: initialState(),
      When: leaveMatchmaking({ playerId: 'p1' }),
      Then: STATE_IS_UNCHANGED,
      And: [],
    }),
  },
  {
    description: 'leaveMatchmaking, different player queued',
    test: fstTest({
      Given: { playerWaitingId: 'p1' },
      When: leaveMatchmaking({ playerId: 'p2' }),
      Then: STATE_IS_UNCHANGED,
      And: [],
    }),
  },
];
