const {Service} = require('egg')

class BRC721Service extends Service {
  async listBRC721Tokens() {
    const db = this.ctx.model
    const {sql} = this.ctx.helper
    let {limit, offset} = this.ctx.state.pagination

    let [{totalCount}] = await db.query(sql`
      SELECT COUNT(DISTINCT(brc721_token.contract_address)) AS count FROM brc721_token
      INNER JOIN brc721 USING (contract_address)
    `, {type: db.QueryTypes.SELECT, transaction: this.ctx.state.transaction})
    let list = await db.query(sql`
      SELECT
        contract.address_string AS address, contract.address AS addressHex,
        brc721.name AS name, brc721.symbol AS symbol, brc721.total_supply AS totalSupply,
        list.holders AS holders
      FROM (
        SELECT contract_address, COUNT(*) AS holders FROM brc721_token
        INNER JOIN brc721 USING (contract_address)
        GROUP BY contract_address
        ORDER BY holders DESC
        LIMIT ${offset}, ${limit}
      ) list
      INNER JOIN brc721 USING (contract_address)
      INNER JOIN contract ON contract.address = list.contract_address
      ORDER BY holders DESC
    `, {type: db.QueryTypes.SELECT, transaction: this.ctx.state.transaction})

    return {
      totalCount,
      tokens: list.map(item => ({
        address: item.addressHex.toString('hex'),
        addressHex: item.addressHex,
        name: item.name.toString(),
        symbol: item.symbol.toString(),
        totalSupply: BigInt(`0x${item.totalSupply.toString('hex')}`),
        holders: item.holders
      }))
    }
  }

  async getAllBRC721Balances(hexAddresses) {
    if (hexAddresses.length === 0) {
      return []
    }
    const db = this.ctx.model
    const {sql} = this.ctx.helper
    let list = await db.query(sql`
      SELECT
        contract.address AS addressHex, contract.address_string AS address,
        brc721.name AS name,
        brc721.symbol AS symbol,
        brc721_token.count AS count
      FROM (
        SELECT contract_address, COUNT(*) AS count FROM brc721_token
        WHERE holder IN ${hexAddresses}
        GROUP BY contract_address
      ) brc721_token
      INNER JOIN contract ON contract.address = brc721_token.contract_address
      INNER JOIN brc721 ON brc721.contract_address = brc721_token.contract_address
    `, {type: db.QueryTypes.SELECT, transaction: this.ctx.state.transaction})
    return list.map(item => ({
      address: item.addressHex.toString('hex'),
      addressHex: item.addressHex,
      name: item.name.toString(),
      symbol: item.symbol.toString(),
      count: item.count
    }))
  }
}

module.exports = BRC721Service
