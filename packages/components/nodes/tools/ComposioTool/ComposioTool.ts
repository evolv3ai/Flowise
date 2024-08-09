import { ICommonObject, INode, INodeData, INodeParams } from '../../../src/Interface';
import { getCredentialData, getCredentialParam } from '../../../src/utils';
import { ComposioToolSet } from './core'; // Import the ComposioToolSet from core.ts

class ComposioTool_Tools implements INode {
    label: string;
    name: string;
    version: number;
    description: string;
    type: string;
    icon: string;
    category: string;
    baseClasses: string[];
    credential: INodeParams;
    inputs: INodeParams[];

    constructor() {
        this.label = 'Composio Tool';
        this.name = 'composioTool';
        this.version = 1.0;
        this.type = 'ComposioTool';
        this.icon = 'composio.svg';
        this.category = 'Tools';
        this.description = 'Use as a tool to execute actions using Composio SDK within Flowise';
        this.baseClasses = [this.type, 'Tool'];
        this.credential = {
            label: 'Connect Credential',
            name: 'credential',
            type: 'credential',
            credentialNames: ['composioApi'],
            optional: true
        };
        this.inputs = [
            {
                label: 'Composio Action',
                name: 'action',
                type: 'string'
            },
            {
                label: 'Input Parameters',
                name: 'inputParams',
                type: 'json',
                description: 'Input parameters for the Composio action'
            },
            {
                label: 'Tool Description',
                name: 'description',
                type: 'string',
                description: 'Description of what the tool does.',
                rows: 3,
                placeholder: 'Description of the Composio tool'
            }
        ];
    }

    async init(nodeData: INodeData, input: string, options: ICommonObject): Promise<any> {
        const action = nodeData.inputs?.action as string;
        const inputParams = nodeData.inputs?.inputParams as object;
        const description = nodeData.inputs?.description as string;

        const credentialData = await getCredentialData(nodeData.credential ?? '', options);
        const composioApiKey = getCredentialParam('composioApiToken', credentialData, nodeData);

        if (!composioApiKey) throw new Error('Composio API key is missing');

        const composioToolSet = new ComposioToolSet(
            composioApiKey,
            'https://backend.composio.dev/api/v1/apps',
            'default'
        );

        let result;
        try {
            // Assuming the toolset has a method to perform an action
            const tools = composioToolSet.getActions([action]);
            const tool = tools[0];  // Assuming a single action for simplicity
            result = await tool.func(inputParams);
        } catch (error) {
            throw new Error(`Error executing Composio action: ${error.message}`);
        }

        return result;
    }

    async run(nodeData: INodeData, input: string, options: ICommonObject): Promise<string | ICommonObject> {
        const result = await this.init(nodeData, input, options);
        return result;
    }
}

module.exports = { nodeClass: ComposioTool_Tools };
