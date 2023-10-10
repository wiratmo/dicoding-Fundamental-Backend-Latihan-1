const {nanoid} = require('nanoid')
const InvarianError = require('../../exceptions/InvarianError')
const NotFoundError = require('../../exceptions/NotFoundError')

class NoteService 
{
    constructor()
    {
        this._notes = []
    }

    addNote({title, body, tags})
    {
        const id = nanoid()
        const createdAt = new Date().toISOString()
        const updatedAt = createdAt

        const newNote = {
            title, body, tags, id, createdAt, updatedAt
        }

        this._notes.push(newNote)

        const isSuccess = this._notes.filter((note) => note.id === id)

        if(!isSuccess)
        {
            throw new InvarianError('Catatan gagal ditambahkan') 
        }

        return id
    }

    getNotes()
    {
        return this._notes

    }

    getNoteById(id)
    {
        const note = this._notes.filter((n) => n.id === id)[0];
        
        if (!note) 
        {
            throw new NotFoundError('Catatan tidak ditemukan')
        }
        return note
    }

    editNoteById(id, {title, body, tags})
    {
        const index = this._notes.findIndex((n) => n.id === id);
        
        if (index === -1)
        {
            throw new NotFoundError('Gagal memperbarui catatan, Id tidak ditemukan')
        } 

        const updatedAt = new Date().toString();

        this._notes[index] = {
            ...this._notes[index],
            title,
            body,
            tags,
            updatedAt
        }
    }

    deleteNoteById(id)
    {
        const index = this._notes.findIndex((n) => n.id === id)
        
        if (index === -1) 
        {
            throw new NotFoundError('Catatan gagal dihapus, Id tidak ditemukan')
        }
        this._notes.splice(index, 1);
    }
}

module.exports = NoteService