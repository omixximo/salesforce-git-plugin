import { execCmd, TestSession } from '@salesforce/cli-plugins-testkit';
import { expect } from 'chai';

describe('release create NUTs', () => {
  let session: TestSession;

  before(async () => {
    session = await TestSession.create({ devhubAuthStrategy: 'NONE' });
  });

  after(async () => {
    await session?.clean();
  });

  it('should not crash', () => {
    const command = 'release create';
    const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;
    expect(output).exist;
  });
});
