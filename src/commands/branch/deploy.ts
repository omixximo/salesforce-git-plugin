import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';
import { DeploySetOptions } from '@salesforce/source-deploy-retrieve';

import { RepoFlag, BranchFlag } from '../../flags/flags.js';
import { executeDeploy } from '../../utils/deploy.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('salesforce-git-plugin', 'branch.deploy');

export type BranchDeployResult = {
  success: boolean;
};

export default class BranchDeploy extends SfCommand<BranchDeployResult> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');

  public static readonly flags = {
    repo: RepoFlag(),
    branch: BranchFlag(),
    reverse: Flags.boolean({
      summary: messages.getMessage('flags.reverse.summary'),
      description: messages.getMessage('flags.reverse.description'),
      char: 'r',
      required: false,
      default: false,
    }),
    'target-org': Flags.requiredOrg(),
  };

  public async run(): Promise<BranchDeployResult> {
    this.log('Start command');
    const { flags } = await this.parse(BranchDeploy);

    const git = flags.repo;
    const reverse = flags.reverse;

    const initialBranch = (await git.branch()).current;
    const flagBranch = flags.branch;

    const baseBranch = reverse ? flagBranch : initialBranch;
    const mergeBranch = reverse ? initialBranch : flagBranch;

    if (reverse) {
      await git.checkout(baseBranch);
    }

    await git.merge([mergeBranch, '--no-ff', '--no-commit']);

    const options: DeploySetOptions = {
      usernameOrConnection: flags['target-org'].getConnection(undefined),
    };

    const deploymentResults = await executeDeploy(options, baseBranch);
    const deploySuccess = deploymentResults.response.success;

    if (deploySuccess) {
      await git.commit('Deployed');
    } else {
      await git.merge(['--abort']);
    }

    if (reverse) {
      await git.checkout(initialBranch);
    }

    return {
      success: true,
    };
  }
}
