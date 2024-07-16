import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';
import { ComponentSet, ComponentSetBuilder } from '@salesforce/source-deploy-retrieve';

import { getPackageDirs } from '../../utils/project.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('my-plugin', 'test.test');

export type TestTestResult = {
  path: string;
};

export default class TestTest extends SfCommand<TestTestResult> {
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

  private componentSet!: ComponentSet;

  public async run(): Promise<TestTestResult> {
    // const { flags } = await this.parse(TestTest);
    this.log('This is the TEST');

    const paths: string[] = [];

    paths.push(
      'C:\\Users\\XimoMorlanesCompan\\vidacaixa\\vidacaixa-service\\force-app\\main\\default\\customMetadata\\COL_MapeoClasificacionSalesforceFilenet.Seguros016.md-meta.xml'
    );

    this.componentSet = await ComponentSetBuilder.build({
      sourceapiversion: '60.0',
      sourcepath: paths,
      manifest: {
        manifestPath:
          'C:\\Users\\XimoMorlanesCompan\\vidacaixa\\vidacaixa-service\\manifest\\release\\bau\\240613\\package.xml',
        directoryPaths: await getPackageDirs(),
      },
      metadata: undefined,
      projectDir: this.project?.getPath(),
    });

    const copmonentToAdd: ComponentSet = await ComponentSetBuilder.build({
      sourcepath: [
        'C:\\Users\\XimoMorlanesCompan\\vidacaixa\\vidacaixa-service\\force-app\\main\\dev\\namedCredentials\\API_GATEWAY.namedCredential-meta.xml',
      ],
    });

    for (const component of copmonentToAdd) {
      this.log('component.fullName');
      this.log(component.fullName);
      this.componentSet.add(component);
    }

    this.logJson(this.componentSet.size);
    this.log(await this.componentSet.getPackageXml(4));
    this.logJson(this.componentSet.getSourceComponents());

    this.log('This is the end of TEST');
    return {
      path: 'C:\\Users\\XimoMorlanesCompan\\sfdx_plugins\\my-plugin\\src\\commands\\test\\test.ts',
    };
  }
}
