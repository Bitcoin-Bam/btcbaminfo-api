module.exports = app => {
  const {CHAR} = app.Sequelize

  let BRC721Token = app.model.define('brc721_token', {
    contractAddress: {
      type: CHAR(20).BINARY,
      primaryKey: true
    },
    tokenId: {
      type: CHAR(32).BINARY,
      primaryKey: true
    },
    holder: CHAR(20).BINARY
  }, {freezeTableName: true, underscored: true, timestamps: false})

  BRC721Token.associate = () => {
    const {Contract} = app.model
    Contract.hasMany(BRC721Token, {as: 'brc721Tokens', foreignKey: 'contractAddress'})
    BRC721Token.belongsTo(Contract, {as: 'contract', foreignKey: 'contractAddress'})
  }

  return BRC721Token
}
