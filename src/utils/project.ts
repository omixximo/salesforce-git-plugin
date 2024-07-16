import { SfProject } from '@salesforce/core';

export async function getPackageDirs(): Promise<string[]> {
  const project = await SfProject.resolve();
  return project.getUniquePackageDirectories().map((pDir) => pDir.fullPath);
}
