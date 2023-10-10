// membuat turunan dari class clientError

const ClientError = require('./ClientError')

class InvarianError extends ClientError 
{
    constructor(message)
    {
        super(message)
        this.name = 'InvarianError'
    }
}

module.exports = InvarianError