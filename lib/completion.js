const fun_ = (current, argv, done) => {
    console.log(current, argv, done)
    // setTimeout(function() {
    //   done([
    //     'apple',
    //     'banana'
    //   ]);
    // }, 500)
    
    
    // 'current' is the current command being completed.
    // 'argv' is the parsed arguments so far.
    // simply return an array of completions.
    return [
      'foo',
      'bar'
    ];
}

module.exports = fun_