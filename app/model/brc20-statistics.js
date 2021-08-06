module.exports = app => {
  const {INTEGER, CHAR} = app.Sequelize

  let BRC20Statistics = app.model.define('brc20_statistics', {
    contractAddress: {
      type: CHAR(20).BINARY,
      primaryKey: true
    },
    holders: INTEGER.UNSIGNED,
    transactions: INTEGER.UNSIGNED
  }, {freezeTableName: true, underscored: true, timestamps: false})

  BRC20Statistics.associate = () => {
    const {Brc20: BRC20} = app.model
    BRC20Statistics.belongsTo(BRC20, {as: 'brc20', foreignKey: 'contractAddress'})
    BRC20.hasOne(BRC20Statistics, {as: 'statistics', foreignKey: 'contractAddress'})
  }

  return BRC20Statistics
}
