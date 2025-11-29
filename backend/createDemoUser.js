const bcrypt = require('bcrypt');
const sequelize = require('./sequelize');
const User = require('./models/user');

async function createDemoUser() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos exitosa.\n');

    // Datos del nuevo usuario demo
    const username = 'demo';
    const email = 'demo@casino.com';
    const password = 'demo123';
    const role = 'cliente';
    const saldo = 5000.00;

    // Verificar si ya existe
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      console.log('❌ El usuario "demo" ya existe.\n');
      console.log('Credenciales:');
      console.log(`  Username: ${username}`);
      console.log(`  Password: ${password}`);
      return;
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    await User.create({
      username,
      email,
      password: hashedPassword,
      role,
      saldo,
      activo: true
    });

    console.log('✅ Usuario demo creado exitosamente!\n');
    console.log('====== CREDENCIALES DEL CLIENTE DEMO ======');
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log(`Email: ${email}`);
    console.log(`Rol: ${role}`);
    console.log(`Saldo inicial: $${saldo.toFixed(2)}`);
    console.log('===========================================\n');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

createDemoUser();
