require("dotenv").config();

// import package
const Hapi = require("@hapi/hapi");
// import class deri file notes
// notes digunakan untuk menghandle inputan dan aksi dari setiap masukkan
const notes = require("./api/notes");
const users = require("./api/users");
// import class deri file note service
// noteservice digunakan untuk melakukan pelayanan dasar dari setiap permintaan sebelum disimpan pada memory
// const NotesService = require('./services/inMemory/NoteService')

// penyimpanan ke dalam database posgres
const NotesService = require("./services/postgres/NoteService");

const Jwt = require("@hapi/jwt");

// note validation
// mengatur validasai dari inputan

const NotesValidator = require("./validator/notes");
const UserService = require("./services/postgres/UserService");
const AuthenticationsService = require("./services/postgres/AuthenticationService");
const UserValidator = require("./validator/users");
const authentications = require("./api/authentications");
const TokenManager = require("./tokenize/TokenManager");
const AuthenticationsValidator = require("./validator/authentications");

const init = async () => {
  // mambuat suatu object dari kelas noteService
  const notesService = new NotesService();
  const userService = new UserService();
  const authenticationsService = new AuthenticationsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy("notesapp_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  // mendaftarkan suatu server dengan plugin pada notes dengan service noteService
  await server.register([
    {
      plugin: notes,
      options: {
        service: notesService,
        validator: NotesValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: userService,
        validator: UserValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService: authenticationsService,
        usersService: userService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server is running on ${server.info.uri}`);
};

init();
