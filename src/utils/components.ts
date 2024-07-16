import fs from 'node:fs';

import { ComponentSetBuilder } from '@salesforce/source-deploy-retrieve';

import { getPackageDirs } from './project.js';

export async function mergePackageXmls(paths: string[]): Promise<string> {
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

  return componentSet.getPackageXml();
}

export async function mergeBranchPackages(branches: string[]): Promise<string> {
  const paths: string[] = [];

  for (let branch of branches) {
    if (branch.startsWith('origin/')) {
      branch = branch.replace('origin/', '');
    }
    const path = './manifest/' + branch + '/package.xml';
    if (fs.existsSync(path)) {
      paths.push(path);
    }
  }

  return mergePackageXmls(paths);
}
