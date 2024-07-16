import fs from 'node:fs';

import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('my-plugin', 'test.test2');

export type TestTest2Result = {
  path: string;
};

export default class TestTest2 extends SfCommand<TestTest2Result> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');

  public static readonly flags = {
    name: Flags.string({
      summary: messages.getMessage('flags.name.summary'),
      description: messages.getMessage('flags.name.description'),
      char: 'n',
      required: false,
    }),
  };

  public async run(): Promise<TestTest2Result> {
    const { flags } = await this.parse(TestTest2);

    this.logJson(fs.existsSync('./manifest/' + flags.name + '/package.xml'));

    return {
      path: 'C:\\Users\\XimoMorlanesCompan\\sfdx_plugins\\my-plugin\\src\\commands\\test\\test2.ts',
    };
  }
}
