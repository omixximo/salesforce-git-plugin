import { Flags, SfCommand } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';
import { RepoFlag, BranchesFlag } from '../../flags/flags.js';
import { mergeBranchPackages } from '../../utils/components.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('my-plugin', 'release.create');

export type ReleaseCreateResult = {
  success: boolean;
};

export default class ReleaseCreate extends SfCommand<ReleaseCreateResult> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');

  public static readonly flags = {
    repo: RepoFlag(),
    branches: BranchesFlag(),
    'release-name': Flags.string({
      summary: messages.getMessage('flags.release-name.summary'),
      description: messages.getMessage('flags.release-name.description'),
      required: true,
    }),
  };

  public async run(): Promise<ReleaseCreateResult> {
    const { flags } = await this.parse(ReleaseCreate);

    const git = flags.repo;

    await git.checkoutBranch('release/' + flags['release-name'], 'master');

    await git.merge(['--no-ff', ...flags.branches]);

    const output = await mergeBranchPackages(flags.branches);
    this.log(output);

    return {
      success: true,
    };
  }
}
