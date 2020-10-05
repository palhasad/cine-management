const {Model, DataTypes} = require('sequelize');
const sequelizePaginate = require('sequelize-paginate')
class Users extends Model {
  static init(sequelize) {
    super.init({
    nome: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    nivel: DataTypes.INTEGER,
    faturamento: DataTypes.STRING,
    }, {
      sequelize,
      tableName: 'Users',
    });
  }

  static associate(models) {
    this.hasMany(models.Seats, { foreignKey: 'user_id', as: 'seats' });
    this.hasMany(models.Notifications, { foreignKey: 'user_id', as: 'notifications' });
  }
}
sequelizePaginate.paginate(Users)
module.exports = Users;