const sequelize = require('./sequelize');
const User = require('./models/user');

async function listUsers() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos exitosa.\n');

    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'role', 'saldo', 'activo'],
      raw: true
    });

    console.log('====== USUARIOS EN LA BASE DE DATOS ======\n');
    
    if (users.length === 0) {
      console.log('No hay usuarios registrados.\n');
    } else {
      users.forEach(user => {
        console.log(`ID: ${user.id}`);
        console.log(`Username: ${user.username}`);
        console.log(`Email: ${user.email}`);
        console.log(`Rol: ${user.role}`);
        console.log(`Saldo: $${user.saldo}`);
        console.log(`Activo: ${user.activo ? 'Sí' : 'No'}`);
        console.log('----------------------------\n');
      });
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

listUsers();
