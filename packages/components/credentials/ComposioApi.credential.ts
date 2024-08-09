import { INodeParams, INodeCredential } from '../src/Interface'

class ComposioApi implements INodeCredential {
    label: string
    name: string
    version: number
    description: string
    inputs: INodeParams[]

    constructor() {
        this.label = 'Composio API'
        this.name = 'composioApi'
        this.version = 1.0
        this.description =
            'You can find the Composio API token on your <a target="_blank" href="https://app.composio.dev/settings">Composio account</a> page.'
        this.inputs = [
            {
                label: 'Composio API Key',
                name: 'composioApi',
                type: 'password'
            }
        ]
    }
}

module.exports = { credClass: ComposioApi }