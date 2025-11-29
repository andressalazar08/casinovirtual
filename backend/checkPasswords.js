const bcrypt = require('bcrypt');
const sequelize = require('./sequelize');
const User = require('./models/user');

async function checkPasswords() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos exitosa.\n');

    const users = await User.findAll({
      attributes: ['id', 'username', 'password'],
      raw: true
    });

    console.log('====== VERIFICANDO CONTRASEÑAS ======\n');
    
    // Contraseñas comunes a probar
    const commonPasswords = [
      'admin', 'andres', 'felipe', 
      '123456', '1234', '12345', '123',
      'password', 'Password123', 
      'admin123', 'andres123', 'felipe123',
      'Admin123', 'Andres123', 'Felipe123',
      'casino', 'Casino123'
    ];
    
    for (const user of users) {
      console.log(`\nUsuario: ${user.username}`);
      console.log('Probando contraseñas comunes...');
      
      // Agregar contraseñas personalizadas por usuario
      const personalizedPasswords = [
        user.username,
        `${user.username}123`,
        `${user.username.charAt(0).toUpperCase()}${user.username.slice(1)}123`,
        ...commonPasswords
      ];
      
      let found = false;
      for (const pwd of personalizedPasswords) {
        const isMatch = await bcrypt.compare(pwd, user.password);
        if (isMatch) {
          console.log(`  ✅ Contraseña encontrada: "${pwd}"`);
          found = true;
          break;
        }
      }
      
      if (!found) {
        console.log(`  ❌ Contraseña no encontrada en la lista común`);
      }
    }
    
    console.log('\n');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

checkPasswords();
