const ClientError = require("../../exceptions/ClientError");

// class untuk menghandle aksi
class NotesHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postNoteHandler = this.postNoteHandler.bind(this);
    this.getNotesHandler = this.getNotesHandler.bind(this);
    this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
    this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
    this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
  }

  postNoteHandler(request, h) {
    try {
      this._validator.validateNotePayload(request.payload);

      const { title = "untitle", body, tags } = request.payload;
      const noteId = this._service.addNote({ title, body, tags });

      const response = h.response({
        status: "success",
        message: "Catatan berhasil ditambahkan",
        data: {
          noteId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });

        response.code(error.statusCode);
        return response;
      }
      
      // Server Error 
      const response = h.response({
        status: "fail",
        message: 'Maaf, terjadi kegagalan pada server kami',
      });

      response.code(500);

      return response;
    }
  }

  getNotesHandler() {
    const notes = this._service.getNotes();
    return {
      status: "success",
      data: {
        notes,
      },
    };
  }

  getNoteByIdHandler(request, h) {
    try {
      const { id } = request.params;

      const note = this._service.getNoteById(id);

      return h.response({
        status: "success",
        data: {
          note,
        },
      });
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });

        response.code(error.statusCode);
        return response;
      }
      
      // Server Error 
      const response = h.response({
        status: "fail",
        message: 'Maaf, terjadi kegagalan pada server kami',
      });

      response.code(500);

      return response;
    }
  }

  putNoteByIdHandler(request, h) {
    try {
      this._validator.validateNotePayload(request.payload);

      const { id } = request.params;

      this._service.editNoteById(id, request.payload);

      return h.response({
        status: "success",
        message: "Catatan berhasil diperbarui",
      });
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });

        response.code(error.statusCode);
        return response;
      }
      
      // Server Error 
      const response = h.response({
        status: "fail",
        message: 'Maaf, terjadi kegagalan pada server kami',
      });

      response.code(500);

      return response;
    }
  }

  deleteNoteByIdHandler(request, h) {
    try {
      const { id } = request.params;
      this._service.deleteNoteById(id);

      return h.response({
        status: "success",
        message: "Catatan berhasil dihapus",
      });
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });

        response.code(error.statusCode);
        return response;
      }
      
      // Server Error 
      const response = h.response({
        status: "fail",
        message: 'Maaf, terjadi kegagalan pada server kami',
      });

      response.code(500);

      return response;
    }
  }
}

module.exports = NotesHandler;