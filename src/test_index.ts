import { createConsoleReporter, createTestRunner } from '@cow-sunday/cowtest';
import { matchmakerFifoTestCases } from './matchmakers/matchmaker_fifo.test';

const reporter = createConsoleReporter();
const testRunner = createTestRunner(reporter);

const testCases = matchmakerFifoTestCases();

testRunner.run(testCases);
