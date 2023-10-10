// import package
const Hapi = require('@hapi/hapi')
// import class deri file notes
// notes digunakan untuk menghandle inputan dan aksi dari setiap masukkan
const notes = require('./api/notes')
// import class deri file note service
// noteservice digunakan untuk melakukan pelayanan dasar dari setiap permintaan sebelum disimpan pada database
const NotesService = require('./services/inMemory/NoteService')

// note validation
// mengatur validasai dari inputan

const NotesValidator = require('./validator/notes')


const init = async () => {
    // mambuat suatu object dari kelas noteService 
    const notesService = new NotesService()

    const server = Hapi.server({
        port : 5000,
        host : 'localhost',
        routes : {
            cors : {
                origin : ['*']
            }
        }
    })

    // mendaftarkan suatu server dengan plugin pada notes dengan service noteService
    await server.register({
        plugin : notes,
        options : {
            service: notesService,
            validator: NotesValidator
        }
    })

    await server.start()
    console.log(`Server is running on ${server.info.uri}`);
}

init()