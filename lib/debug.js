function debug(args) {
  args = [].slice.call(arguments)

  if (process.env.NODE_ENV === 'development') {
    const ret = args.reduce(function(acc, val, i) {
        return acc.concat(typeof val === 'object' ? JSON.stringify(val) : val)
    }, []);

    console.log.apply(console, ret)
  }
}

module.exports = debug
