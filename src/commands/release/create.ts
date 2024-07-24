import { Flags, SfCommand } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';
import { RepoFlag, BranchesFlag } from '../../flags/flags.js';
import { getBranchManifestFolder, mergeBranchPackages, savePackage } from '../../utils/components.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('salesforce-git-plugin', 'release.create');

export type ReleaseCreateResult = {
  success: boolean;
  packageXml: string;
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

    const releaseBranch = 'release/' + flags['release-name'];
    await git.checkoutBranch(releaseBranch, 'master');

    await git.merge(['--no-ff', ...flags.branches]);

    const output = await mergeBranchPackages(flags.branches);

    // Write the package.xml to manifest/release/<release-name>/package.xml
    const packageFolder = getBranchManifestFolder(releaseBranch);
    await savePackage(output, packageFolder);

    // Save the package.xml to the release branch
    await git.add([packageFolder]);
    await git.commit(`Created ${flags['release-name']} package.xml`);

    return {
      success: true,
      packageXml: await output.getPackageXml(),
    };
  }
}
