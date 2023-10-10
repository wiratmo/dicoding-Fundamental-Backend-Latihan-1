// mem-functionkan validator dengan memanfaatkan schema
const InvarianError = require('../../exceptions/InvarianError')
const {NotePayloadSchema} = require('./schema')


const NotesValidator = {
    validateNotePayload: (payload) => {
        const validationResult = NotePayloadSchema.validate(payload)

        if(validationResult.error){
            throw new InvarianError(validationResult.error.message)
        }
    },
}

module.exports = NotesValidator