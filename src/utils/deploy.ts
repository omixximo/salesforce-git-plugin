import {
  ComponentSetBuilder,
  DeployResult,
  DeploySetOptions,
  MetadataApiDeploy,
} from '@salesforce/source-deploy-retrieve';

import { getBranchManifestFolder } from './components.js';
import { getPackageDirs } from './project.js';

export async function executeDeploy(options: DeploySetOptions, currentBranch: string): Promise<DeployResult> {
  // Get component Set
  const componentSet = await ComponentSetBuilder.build({
    manifest: {
      manifestPath: `${getBranchManifestFolder(currentBranch)}/package.xml`,
      directoryPaths: await getPackageDirs(),
    },
  });

  if (options.usernameOrConnection === undefined) {
    throw new Error('No username or connection provided');
  }

  const deploy: MetadataApiDeploy = await componentSet.deploy(options);
  await deploy.start();

  const result = await deploy.pollStatus();

  return result;
}
