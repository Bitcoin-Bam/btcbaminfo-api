module.exports = app => {
  const {CHAR, BLOB} = app.Sequelize

  let BRC721 = app.model.define('brc721', {
    contractAddress: {
      type: CHAR(20).BINARY,
      primaryKey: true
    },
    name: {
      type: BLOB,
      get() {
        return this.getDataValue('name').toString()
      },
      set(name) {
        this.setDataValue('name', Buffer.from(name))
      }
    },
    symbol: {
      type: BLOB,
      get() {
        return this.getDataValue('symbol').toString()
      },
      set(symbol) {
        this.setDataValue('symbol', Buffer.from(symbol))
      }
    },
    totalSupply: {
      type: CHAR(32).BINARY,
      get() {
        let totalSupply = this.getDataValue('totalSupply')
        return totalSupply == null ? null : BigInt(`0x${totalSupply.toString('hex')}`)
      },
      set(totalSupply) {
        this.setDataValue(
          'totalSupply',
          Buffer.from(totalSupply.toString(16).padStart(64, '0'), 'hex')
        )
      }
    }
  }, {freezeTableName: true, underscored: true, timestamps: false})

  BRC721.associate = () => {
    const {EvmReceiptLog: EVMReceiptLog, Contract} = app.model
    EVMReceiptLog.belongsTo(BRC721, {as: 'brc721', foreignKey: 'address', sourceKey: 'contractAddress'})
    BRC721.hasOne(EVMReceiptLog, {as: 'logs', foreignKey: 'address', sourceKey: 'contractAddress'})
    Contract.hasOne(BRC721, {as: 'brc721', foreignKey: 'contractAddress'})
    BRC721.belongsTo(Contract, {as: 'contract', foreignKey: 'contractAddress'})
  }

  return BRC721
}
