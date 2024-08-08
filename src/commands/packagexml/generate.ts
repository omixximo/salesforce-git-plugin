import { SfCommand } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';
import { ComponentSetBuilder } from '@salesforce/source-deploy-retrieve';

import { BranchFlag, RepoFlag } from '../../flags/flags.js';
import { getIndexCommit, getFilesMergeDiff } from '../../utils/git.js';
import { getBranchManifestFolder, savePackage } from '../../utils/components.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('salesforce-git-plugin', 'packagexml.generate');

export type PackagexmlGenerateResult = {
  created: boolean;
};

export default class PackagexmlGenerate extends SfCommand<PackagexmlGenerateResult> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');

  public static readonly flags = {
    'master-branch': BranchFlag({
      default: 'master',
    }),
    repo: RepoFlag(),
  };

  public async run(): Promise<PackagexmlGenerateResult> {
    const { flags } = await this.parse(PackagexmlGenerate);

    const git = flags.repo;

    // Get files changed
    const head = await getIndexCommit(git);
    this.log(head);
    let paths: string[] = await getFilesMergeDiff(git, flags['master-branch'], head);

    paths = paths.filter((path) => path.startsWith('force-app'));

    // Create package
    const componentSet = await ComponentSetBuilder.build({
      sourcepath: paths,
      projectDir: this.project?.getPath(),
    });

    // TODO: Join with the current package.xml
    const currentBranch = (await git.branch()).current;
    const packageFolder = getBranchManifestFolder(currentBranch);
    await savePackage(componentSet, packageFolder);

    return {
      created: true,
    };
  }
}
