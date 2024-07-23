import { Flags } from '@oclif/core';
import { Messages } from '@salesforce/core';
//  ConfigAggregator Org, OrgConfigProperties
import { simpleGit, SimpleGit } from 'simple-git';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);

const messages = Messages.loadMessages('salesforce-git-plugin', 'messages');

export function maybeGetGit(input: string): Promise<SimpleGit>;
export function maybeGetGit(input: undefined): Promise<undefined>;
export function maybeGetGit(input?: string | undefined): Promise<SimpleGit | undefined>;
export function maybeGetGit(input?: string | undefined): Promise<SimpleGit | undefined> {
  return new Promise((resolve, reject) => {
    try {
      // .checkIsRepo()
      const dir = input ? input : process.cwd();
      resolve(simpleGit(dir));
    } catch (e) {
      if (!input) {
        resolve(undefined);
      } else {
        reject(e);
      }
    }
  });
}

export const getGitOrThrow = async (input?: string): Promise<SimpleGit> => {
  const git = await maybeGetGit(input);
  if (!git) {
    throw messages.createError('errors.NoDefaultRepo');
  }
  return git;
};

export const validateBranch = async (input: string): Promise<string> => {
  const git = await getGitOrThrow();
  let targetBranch: string = input;

  const branchResults = await git.branch();
  const isLocal = !targetBranch.startsWith('origin/');

  let validBranch: boolean;
  if (isLocal) {
    if (branchResults.all.includes(targetBranch)) {
      validBranch = true;
    } else {
      validBranch = branchResults.all.includes('remotes/origin/' + targetBranch);
      if (validBranch) {
        // TODO Add warning if the branch is only in the remote
        targetBranch = 'origin/' + targetBranch;
      }
    }
  } else {
    validBranch = branchResults.all.includes('remotes/' + targetBranch);
  }

  if (!validBranch) {
    throw messages.createError('errors.BranchNotInRemote');
  }

  return targetBranch;
};

export const RepoFlag = Flags.custom({
  char: 'r',
  summary: messages.getMessage('flags.repo.summary'),
  noCacheDefault: true,
  parse: async (input: string) => getGitOrThrow(input),
  default: async () => getGitOrThrow(),
  required: true,
});

export const BranchFlag = Flags.custom({
  char: 'b',
  summary: messages.getMessage('flags.branch.summary'),
  noCacheDefault: true,
  parse: async (input: string) => validateBranch(input),
  required: true,
});

export const BranchesFlag = Flags.custom({
  multiple: true,
  summary: messages.getMessage('flags.branches.summary'),
  noCacheDefault: true,
  parse: async (input: string) => validateBranch(input),
  required: true,
});
