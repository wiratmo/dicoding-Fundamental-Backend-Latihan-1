const { Pool } = require("pg");
const {nanoid} = require('nanoid')
const bcrypt = require('bcrypt');
const InvarianError = require("../../exceptions/InvarianError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthenticationError = require("../../exceptions/AuthenticationError");

class UserService
{
    constructor()
    {
        this._pool = new Pool()
    }

    async addUser({username, password, fullname})
    {
        // TODO: Verifikasi username, pastikan belum terdaftar

        await this.verifyNewUsername(username)

        // TODO: Bila verivikasi lolos, maka masukkan user baru ke database
        const id = `user-${nanoid(16)}`

        const hashedPassword = await bcrypt.hash(password, 10)

        const query = {
            text: 'INSERT INTO users (id, username, password, fullname) VALUES ($1, $2, $3, $4) RETURNING id',
            values: [id, username, hashedPassword, fullname]
        }
        const result = await this._pool.query(query)

        if(! result.rowCount)
        {
            throw new InvarianError('user gagal ditambahkan')
        }

        return result.rows[0].id;

    }

    async verifyNewUsername(username)
    {
        const query = {
            text: 'SELECT username FROM users where username = $1',
            values: [username]
        }

        const result = await this._pool.query(query)

        if(result.rowCount > 0){
            throw new InvarianError('Gagal menambahkan user. Username sudah digunakan.')
        }
    }

    async getUserById(id)
    {
        const query = {
            text: 'SELECT id, username, fullname FROM users WHERE id = $1',
            values: [id]
        }

        
        const result = await this._pool.query(query)
        
        if(!result.rowCount )
        {
            throw new NotFoundError('User tidak ditemukan')
        }
        return result.rows[0]
    }

    async verifyUserCredential(username, password) 
    {
        const query = {
            text: 'SELECT id, password FROM users WHERE username = $1',
            values: [username],
          };
          const result = await this._pool.query(query);
          console.log(result.rowCount);

          if (!result.rowCount) {
            throw new AuthenticationError('Kredensial yang Anda berikan salah')
          }

          const { id, password: hashedPassword } = result.rows[0];

          const match = await bcrypt.compare(password, hashedPassword)

          if (!match) {
            throw new AuthenticationError('Kredensial yang Anda berikan salah')
          }

          return id
    }
}

module.exports = UserService