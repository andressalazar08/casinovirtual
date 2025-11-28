const bcrypt = require('bcrypt');
const sequelize = require('./sequelize');
const User = require('./models/user');

async function createAdminUser() {
  try {
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos exitosa');

    // Sincronizar modelos (crear tablas si no existen)
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados');

    // Verificar si ya existe un admin
    const existingAdmin = await User.findOne({ where: { role: 'admin' } });
    
    if (existingAdmin) {
      console.log('⚠️  Ya existe un usuario administrador en la base de datos');
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Username:', existingAdmin.username);
      process.exit(0);
    }

    // Crear usuario administrador
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@casino.com',
      password: hashedPassword,
      role: 'admin',
      saldo: 10000.00,
      activo: true
    });

    console.log('\n🎉 Usuario administrador creado exitosamente!');
    console.log('================================');
    console.log('📧 Email: admin@casino.com');
    console.log('🔑 Contraseña: admin123');
    console.log('👤 Username: admin');
    console.log('💰 Saldo inicial: $10,000.00');
    console.log('================================');
    console.log('\n⚠️  IMPORTANTE: Cambia la contraseña después del primer login');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear usuario administrador:', error);
    process.exit(1);
  }
}

createAdminUser();
