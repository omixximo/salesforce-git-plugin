import { Flags } from '@oclif/core';
import { Messages } from '@salesforce/core';
//  ConfigAggregator Org, OrgConfigProperties
import { simpleGit, SimpleGit } from 'simple-git';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);

const messages = Messages.loadMessages('my-plugin', 'messages');

export function maybeGetGit(input: string): Promise<SimpleGit>;
export function maybeGetGit(input: undefined): Promise<undefined>;
export function maybeGetGit(input?: string | undefined): Promise<SimpleGit | undefined>;
export function maybeGetGit(input?: string | undefined): Promise<SimpleGit | undefined> {
  return new Promise((): SimpleGit | undefined => {
    try {
      // .checkIsRepo()
      const dir = input ? input : process.cwd();
      return simpleGit(dir);
    } catch (e) {
      if (!input) {
        return undefined;
      } else {
        throw e;
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
  const targetBranch: string = input;

  const branchResults = await git.branch();
  const validBranch = branchResults.all.includes(targetBranch) || branchResults.all.includes('remotes/' + targetBranch);
  if (!validBranch) {
    throw messages.createError('errors.BranchNotInRemote');
  }

  return targetBranch;
};

export const RepoFlag = Flags.custom({
  char: 'r',
  summary: messages.getMessage('flags.targetOrg.summary'),
  noCacheDefault: true,
  parse: async (input: string) => getGitOrThrow(input),
  default: async () => getGitOrThrow(),
  required: true,
});

export const BranchFlag = Flags.custom({
  char: 'b',
  summary: messages.getMessage('flags.targetOrg.summary'),
  noCacheDefault: true,
  parse: async (input: string) => validateBranch(input),
  required: true,
});

export const BranchesFlag = Flags.custom({
  char: 'b',
  multiple: true,
  summary: messages.getMessage('flags.targetOrg.summary'),
  noCacheDefault: true,
  parse: async (input: string) => validateBranch(input),
  required: true,
});
