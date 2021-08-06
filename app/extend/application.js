const path = require('path')

const CHAIN = Symbol('btcbam.chain')

module.exports = {
  get chain() {
    this[CHAIN] = this[CHAIN] || this.btcbaminfo.lib.Chain.get(this.config.btcbam.chain)
    return this[CHAIN]
  },
  get btcbaminfo() {
    return {
      lib: require(path.resolve(this.config.btcbaminfo.path, 'lib')),
      rpc: require(path.resolve(this.config.btcbaminfo.path, 'rpc'))
    }
  }
}
