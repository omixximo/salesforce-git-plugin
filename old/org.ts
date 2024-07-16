import { Messages } from '@salesforce/core';
import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { FlagInput } from '@oclif/core/interfaces';

import { simpleGit, SimpleGit } from 'simple-git';
/*
import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';
*/

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('my-plugin', 'connect.org');

export type ConnectOrgResult = {
  path: string;
};

const remote = 'origin';

type ExecutionStatus = {
  originalBranch: string | null;
};

export default class ConnectOrg extends SfCommand<ConnectOrgResult> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');

  public static readonly flags: FlagInput<{ [flag: string]: any }> = {
    'target-org': Flags.requiredOrg(),

    'target-branch': Flags.string({
      summary: messages.getMessage('flags.target-branch.summary'),
      char: 't',
      required: true,
    }),
  };

  private status: ExecutionStatus = {
    originalBranch: null,
  };

  private git: SimpleGit | null = null;

  public async run(): Promise<ConnectOrgResult> {
    const { flags } = await this.parse(ConnectOrg);

    // this.log(flags['target-org']);
    const targetBranch: string = flags['target-branch'];

    // Get and validate git
    this.git = simpleGit('C:/Users/XimoMorlanesCompan/vidacaixa/vidacaixa-service');

    const branchResults = await this.git.branch();
    const originalBranch = branchResults.current;
    this.status.originalBranch = originalBranch;
    const validBranch = branchResults.all.includes('remotes/' + remote + '/' + targetBranch);

    const branchWithChanges = originalBranch;
    this.log(branchWithChanges);

    if (!validBranch) {
      this.error('Target branch is not a valid branch in remote origin.');
    }

    // ** PREPARE LOCAL FILES **

    // Checkout target
    await this.git.checkout(targetBranch);

    // Merge changes
    const mergeResult = await this.git.merge([`origin/${branchWithChanges}`, '--no-commit', '--no-ff']);

    this.logJson(mergeResult);
    // Update .forceignore

    // ** DEPLOY **

    // COMMIT RESULT
    await this.git.merge(['--abort']);

    /*
    try {
      await git.checkout(targetBranch);
    } catch (e) {
      if (e instanceof GitError) {
        this.error(e);
      } else {
        throw e;
      }
    }*/

    return {
      path: 'C:\\Users\\XimoMorlanesCompan\\sfdx_plugins\\my-plugin\\src\\commands\\connect\\org.ts',
    };
  }

  protected async finally(error: Error | undefined): Promise<any> {
    if (error) {
      this.logJson(error);
      this.log('Error received in finally:', error.message);
    }

    if (this.status.originalBranch) {
      await this.git?.checkout(this.status.originalBranch);
    }
    // Call the parent class's finally method if necessary
    return super.finally(error);
  }
}
