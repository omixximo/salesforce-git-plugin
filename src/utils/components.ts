import fs from 'node:fs';

import { ComponentSet, ComponentSetBuilder } from '@salesforce/source-deploy-retrieve';

import { getPackageDirs } from './project.js';

export async function mergePackages(paths: string[]): Promise<ComponentSet> {
  const componentSet = await ComponentSetBuilder.build({
    sourceapiversion: '60.0',
    sourcepath: [],
  });

  await Promise.all(
    paths.map(async (path) => {
      const pathComponent = await ComponentSetBuilder.build({
        manifest: {
          manifestPath: path,
          directoryPaths: await getPackageDirs(),
        },
      });
      for (const component of pathComponent) {
        componentSet.add(component);
      }
    })
  );

  return componentSet;
}

export function getBranchManifestFolder(branch: string): string {
  let filteredBranch = branch;
  if (filteredBranch.startsWith('origin/')) {
    filteredBranch = branch.replace('origin/', '');
  }
  return './manifest/' + filteredBranch;
}

export async function mergeBranchPackages(branches: string[]): Promise<ComponentSet> {
  const paths: string[] = [];

  for (const branch of branches) {
    const path = getBranchManifestFolder(branch) + '/package.xml';
    if (fs.existsSync(path)) {
      paths.push(path);
    }
  }
  const componentSet = await mergePackages(paths);
  return componentSet;
}

export async function savePackage(componentSet: ComponentSet, folder: string): Promise<void> {
  const packageXml = await componentSet.getPackageXml();
  fs.writeFileSync(folder + '/package.xml', packageXml);
}
