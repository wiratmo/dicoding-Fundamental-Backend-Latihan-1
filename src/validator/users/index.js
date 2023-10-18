const InvarianError = require("../../exceptions/InvarianError")
const { UserPayloadSchema } = require("./schema")

const UsersValidator = {
    validateUserPayload: (payload) => {
        const validationResult = UserPayloadSchema.validate(payload)
        if (validationResult.error) {
            throw new InvarianError(validationResult.error.message)
        }
    }
}

module.exports = UsersValidator
