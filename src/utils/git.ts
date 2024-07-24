import { SimpleGit } from 'simple-git';

export async function getFilesMergeDiff(git: SimpleGit, base: string, head: string): Promise<string[]> {
  const mergeTree = (await git.raw(['merge-tree', base, head])).trim();
  // TODO: Return by operation type
  const diffTree = await git.raw(['diff-tree', base, mergeTree, '--name-only', '-r', '--no-renames']);
  return diffTree.split('\n').filter((file) => file !== '');
}

export async function getIndexCommit(git: SimpleGit): Promise<string> {
  const tree = (await git.raw('write-tree')).trim();
  const commit = (await git.raw(['commit-tree', tree, '-p', 'HEAD', '-m', 'virtualcommit'])).trim(); // Some bug is causing that the message must be provided if no it just waits.
  return commit;
}
