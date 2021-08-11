'use strict'

var CACHED_CWiseOp = {
  zero: function(SS, a0, t0, p0) {
      var s0 = SS[0], t0p0 = t0[0]
      p0 |= 0
      var i0 = 0, d0s0 = t0p0
      for (i0 = 0; i0 < s0; ++i0) {
        a0[p0] = 0
        p0 += d0s0
      }
    },

    fdTemplate1: function(SS, a0, t0, p0, a1, t1, p1) {
    var s0 = SS[0], t0p0 = t0[0], t1p0 = t1[0], q0 = -1 * t0p0, q1 = t0p0
    p0 |= 0
    p1 |= 0
    var i0 = 0, d0s0 = t0p0, d1s0 = t1p0
    for (i0 = 0; i0 < s0; ++i0) {
      a1[p1] = 0.5 * (a0[p0 + q0] - a0[p0 + q1])
      p0 += d0s0
      p1 += d1s0
    }
  },

  fdTemplate2: function(SS, a0, t0, p0, a1, t1, p1, a2, t2, p2) {
    var s0 = SS[0], s1 = SS[1], t0p0 = t0[0], t0p1 = t0[1], t1p0 = t1[0], t1p1 = t1[1], t2p0 = t2[0], t2p1 = t2[1], q0 = -1 * t0p0, q1 = t0p0, q2 = -1 * t0p1, q3 = t0p1
    p0 |= 0
    p1 |= 0
    p2 |= 0
    var i0 = 0, i1 = 0, d0s0 = t0p1, d0s1 = (t0p0 - s1 * t0p1), d1s0 = t1p1, d1s1 = (t1p0 - s1 * t1p1), d2s0 = t2p1, d2s1 = (t2p0 - s1 * t2p1)
    for (i1 = 0; i1 < s0; ++i1) {
      for (i0 = 0; i0 < s1; ++i0) {
        a1[p1] = 0.5 * (a0[p0 + q0] - a0[p0 + q1]); a2[p2] = 0.5 * (a0[p0 + q2] - a0[p0 + q3])
        p0 += d0s0
        p1 += d1s0
        p2 += d2s0
      }
      p0 += d0s1
      p1 += d1s1
      p2 += d2s1
    }
  }
}

//Generates a cwise operator
function generateCWiseOp(proc) {
  return CACHED_CWiseOp[proc.funcName]
}

// The function below is called when constructing a cwise function object, and does the following:
// A function object is constructed which accepts as argument a compilation function and returns another function.
// It is this other function that is eventually returned by createThunk, and this function is the one that actually
// checks whether a certain pattern of arguments has already been used before and compiles new loops as needed.
// The compilation passed to the first function object is used for compiling new functions.
// Once this function object is created, it is called with compile as argument, where the first argument of compile
// is bound to "proc" (essentially containing a preprocessed version of the user arguments to cwise).
// So createThunk roughly works like this:
// function createThunk(proc) {
//   var thunk = function(compileBound) {
//     var CACHED = {}
//     return function(arrays and scalars) {
//       if (dtype and order of arrays in CACHED) {
//         var func = CACHED[dtype and order of arrays]
//       } else {
//         var func = CACHED[dtype and order of arrays] = compileBound(dtype and order of arrays)
//       }
//       return func(arrays and scalars)
//     }
//   }
//   return thunk(compile.bind1(proc))
// }

var compile = generateCWiseOp


var CACHED_thunk = {
  cdiff: function(compile) {
    var CACHED = {}
    return function cdiff_cwise_thunk(array0, array1, array2) {
      if (!(array0.shape.length === array1.shape.length + 0 && array0.shape.length === array2.shape.length + 0)) throw new Error('cwise: Arrays do not all have the same dimensionality!')
      for (var shapeIndex = array0.shape.length - 0; shapeIndex-- > 0;) {
        if (!(array0.shape[shapeIndex + 0] === array1.shape[shapeIndex + 0] && array0.shape[shapeIndex + 0] === array2.shape[shapeIndex + 0])) throw new Error('cwise: Arrays do not all have the same shape!')
      }
      var t0 = array0.dtype, r0 = array0.order, t1 = array1.dtype, r1 = array1.order, t2 = array2.dtype, r2 = array2.order, type = [t0, r0.join(), t1, r1.join(), t2, r2.join()].join(), proc = CACHED[type]
      if (!proc) { CACHED[type] = proc = compile([t0, r0, t1, r1, t2, r2]) } return proc(array0.shape.slice(0), array0.data, array0.stride, array0.offset | 0, array1.data, array1.stride, array1.offset | 0, array2.data, array2.stride, array2.offset | 0)
    }
  },

  zero: function(compile) {
    var CACHED = {}
    return function zero_cwise_thunk(array0) {
      var t0 = array0.dtype, r0 = array0.order, type = [t0, r0.join()].join(), proc = CACHED[type]
      if (!proc) { CACHED[type] = proc = compile([t0, r0]) } return proc(array0.shape.slice(0), array0.data, array0.stride, array0.offset | 0)
    }
  },

  fdTemplate1: function(compile) {
    var CACHED = {}
    return function fdTemplate1_cwise_thunk(array0, array1) {
      if (!(array0.shape.length === array1.shape.length + 0)) throw new Error('cwise: Arrays do not all have the same dimensionality!')
      for (var shapeIndex = array0.shape.length - 0; shapeIndex-- > 0;) {
        if (!(array0.shape[shapeIndex + 0] === array1.shape[shapeIndex + 0])) throw new Error('cwise: Arrays do not all have the same shape!')
      }
      var t0 = array0.dtype, r0 = array0.order, t1 = array1.dtype, r1 = array1.order, type = [t0, r0.join(), t1, r1.join()].join(), proc = CACHED[type]
      if (!proc) { CACHED[type] = proc = compile([t0, r0, t1, r1]) } return proc(array0.shape.slice(0), array0.data, array0.stride, array0.offset | 0, array1.data, array1.stride, array1.offset | 0)
    }
  },

  fdTemplate2: function(compile) {
    var CACHED = {}
    return function fdTemplate2_cwise_thunk(array0, array1, array4) {
      if (!(array0.shape.length === array1.shape.length + 0 && array0.shape.length === array4.shape.length + 0)) throw new Error('cwise: Arrays do not all have the same dimensionality!')
      for (var shapeIndex = array0.shape.length - 0; shapeIndex-- > 0;) {
        if (!(array0.shape[shapeIndex + 0] === array1.shape[shapeIndex + 0] && array0.shape[shapeIndex + 0] === array4.shape[shapeIndex + 0])) throw new Error('cwise: Arrays do not all have the same shape!')
      }
      var t0 = array0.dtype, r0 = array0.order, t1 = array1.dtype, r1 = array1.order, t4 = array4.dtype, r4 = array4.order, type = [t0, r0.join(), t1, r1.join(), t4, r4.join()].join(), proc = CACHED[type]
      if (!proc) { CACHED[type] = proc = compile([t0, r0, t1, r1, t4, r4]) } return proc(array0.shape.slice(0), array0.data, array0.stride, array0.offset | 0, array1.data, array1.stride, array1.offset | 0, array4.data, array4.stride, array4.offset | 0)
    }
  },
}

function createThunk(proc) {
  var thunk = CACHED_thunk[proc.funcName]
  return thunk(compile.bind(undefined, proc))
}

function Procedure() {
  this.argTypes = []
  this.shimArgs = []
  this.arrayArgs = []
  this.arrayBlockIndices = []
  this.scalarArgs = []
  this.offsetArgs = []
  this.offsetArgIndex = []
  this.indexArgs = []
  this.shapeArgs = []
  this.funcName = ""
  this.pre = null
  this.body = null
  this.post = null
  this.debug = false
}

function compileCwise(user_args) {
  //Create procedure
  var proc = new Procedure()

  //Parse blocks
  proc.pre    = user_args.pre
  proc.body   = user_args.body
  proc.post   = user_args.post

  //Parse arguments
  var proc_args = user_args.args.slice(0)
  proc.argTypes = proc_args
  for(var i=0; i<proc_args.length; ++i) {
    var arg_type = proc_args[i]
    if(arg_type === "array" || (typeof arg_type === "object" && arg_type.blockIndices)) {
      proc.argTypes[i] = "array"
      proc.arrayArgs.push(i)
      proc.arrayBlockIndices.push(arg_type.blockIndices ? arg_type.blockIndices : 0)
      proc.shimArgs.push("array" + i)
      if(i < proc.pre.args.length && proc.pre.args[i].count>0) {
        throw new Error("cwise: pre() block may not reference array args")
      }
      if(i < proc.post.args.length && proc.post.args[i].count>0) {
        throw new Error("cwise: post() block may not reference array args")
      }
    } else if(arg_type === "scalar") {
      proc.scalarArgs.push(i)
      proc.shimArgs.push("scalar" + i)
    } else if(arg_type === "index") {
      proc.indexArgs.push(i)
      if(i < proc.pre.args.length && proc.pre.args[i].count > 0) {
        throw new Error("cwise: pre() block may not reference array index")
      }
      if(i < proc.body.args.length && proc.body.args[i].lvalue) {
        throw new Error("cwise: body() block may not write to array index")
      }
      if(i < proc.post.args.length && proc.post.args[i].count > 0) {
        throw new Error("cwise: post() block may not reference array index")
      }
    } else if(arg_type === "shape") {
      proc.shapeArgs.push(i)
      if(i < proc.pre.args.length && proc.pre.args[i].lvalue) {
        throw new Error("cwise: pre() block may not write to array shape")
      }
      if(i < proc.body.args.length && proc.body.args[i].lvalue) {
        throw new Error("cwise: body() block may not write to array shape")
      }
      if(i < proc.post.args.length && proc.post.args[i].lvalue) {
        throw new Error("cwise: post() block may not write to array shape")
      }
    } else if(typeof arg_type === "object" && arg_type.offset) {
      proc.argTypes[i] = "offset"
      proc.offsetArgs.push({ array: arg_type.array, offset:arg_type.offset })
      proc.offsetArgIndex.push(i)
    } else {
      throw new Error("cwise: Unknown argument type " + proc_args[i])
    }
  }

  //Make sure at least one array argument was specified
  if(proc.arrayArgs.length <= 0) {
    throw new Error("cwise: No array arguments specified")
  }

  //Make sure arguments are correct
  if(proc.pre.args.length > proc_args.length) {
    throw new Error("cwise: Too many arguments in pre() block")
  }
  if(proc.body.args.length > proc_args.length) {
    throw new Error("cwise: Too many arguments in body() block")
  }
  if(proc.post.args.length > proc_args.length) {
    throw new Error("cwise: Too many arguments in post() block")
  }

  //Check debug flag
  proc.debug = !!user_args.printCode || !!user_args.debug

  //Retrieve name
  proc.funcName = user_args.funcName || "cwise"

  //Read in block size
  proc.blockSize = user_args.blockSize || 64

  return createThunk(proc)
}


module.exports      = gradient

var dup             = require('dup')
var cwiseCompiler   = compileCwise

var TEMPLATE_CACHE  = {}
var GRADIENT_CACHE  = {}

var EmptyProc = {
  body: "",
  args: [],
  thisVars: [],
  localVars: []
}

var centralDiff = cwiseCompiler({
  args: [ 'array', 'array', 'array' ],
  pre: EmptyProc,
  post: EmptyProc,
  body: {
    args: [ {
      name: 'out',
      lvalue: true,
      rvalue: false,
      count: 1
    }, {
      name: 'left',
      lvalue: false,
      rvalue: true,
      count: 1
    }, {
      name: 'right',
      lvalue: false,
      rvalue: true,
      count: 1
    }],
    body: "out=0.5*(left-right)",
    thisVars: [],
    localVars: []
  },
  funcName: 'cdiff'
})

var zeroOut = cwiseCompiler({
  args: [ 'array' ],
  pre: EmptyProc,
  post: EmptyProc,
  body: {
    args: [ {
      name: 'out',
      lvalue: true,
      rvalue: false,
      count: 1
    }],
    body: "out=0",
    thisVars: [],
    localVars: []
  },
  funcName: 'zero'
})

function generateTemplate(d) {
  if(d in TEMPLATE_CACHE) {
    return TEMPLATE_CACHE[d]
  }
  var code = []
  for(var i=0; i<d; ++i) {
    code.push('out', i, 's=0.5*(inp', i, 'l-inp', i, 'r);')
  }
  var args = [ 'array' ]
  var names = ['junk']
  for(var i=0; i<d; ++i) {
    args.push('array')
    names.push('out' + i + 's')
    var o = dup(d)
    o[i] = -1
    args.push({
      array: 0,
      offset: o.slice()
    })
    o[i] = 1
    args.push({
      array: 0,
      offset: o.slice()
    })
    names.push('inp' + i + 'l', 'inp' + i + 'r')
  }
  return TEMPLATE_CACHE[d] = cwiseCompiler({
    args: args,
    pre:  EmptyProc,
    post: EmptyProc,
    body: {
      body: code.join(''),
      args: names.map(function(n) {
        return {
          name: n,
          lvalue: n.indexOf('out') === 0,
          rvalue: n.indexOf('inp') === 0,
          count: (n!=='junk')|0
        }
      }),
      thisVars: [],
      localVars: []
    },
    funcName: 'fdTemplate' + d
  })
}

function generateGradient(boundaryConditions) {
  var token = boundaryConditions.join()
  var proc = GRADIENT_CACHE[token]
  if(proc) {
    return proc
  }

  var d = boundaryConditions.length
  var code = ['function gradient(dst,src){var s=src.shape.slice();' ]

  function handleBoundary(facet) {
    var cod = d - facet.length

    var loStr = []
    var hiStr = []
    var pickStr = []
    for(var i=0; i<d; ++i) {
      if(facet.indexOf(i+1) >= 0) {
        pickStr.push('0')
      } else if(facet.indexOf(-(i+1)) >= 0) {
        pickStr.push('s['+i+']-1')
      } else {
        pickStr.push('-1')
        loStr.push('1')
        hiStr.push('s['+i+']-2')
      }
    }
    var boundStr = '.lo(' + loStr.join() + ').hi(' + hiStr.join() + ')'
    if(loStr.length === 0) {
      boundStr = ''
    }

    if(cod > 0) {
      code.push('if(1')
      for(var i=0; i<d; ++i) {
        if(facet.indexOf(i+1) >= 0 || facet.indexOf(-(i+1)) >= 0) {
          continue
        }
        code.push('&&s[', i, ']>2')
      }
      code.push('){grad', cod, '(src.pick(', pickStr.join(), ')', boundStr)
      for(var i=0; i<d; ++i) {
        if(facet.indexOf(i+1) >= 0 || facet.indexOf(-(i+1)) >= 0) {
          continue
        }
        code.push(',dst.pick(', pickStr.join(), ',', i, ')', boundStr)
      }
      code.push(');')
    }

    for(var i=0; i<facet.length; ++i) {
      var bnd = Math.abs(facet[i])-1
      var outStr = 'dst.pick(' + pickStr.join() + ',' + bnd + ')' + boundStr
      switch(boundaryConditions[bnd]) {

        case 'clamp':
          var cPickStr = pickStr.slice()
          var dPickStr = pickStr.slice()
          if(facet[i] < 0) {
            cPickStr[bnd] = 's[' + bnd + ']-2'
          } else {
            dPickStr[bnd] = '1'
          }
          if(cod === 0) {
            code.push('if(s[', bnd, ']>1){dst.set(',
              pickStr.join(), ',', bnd, ',0.5*(src.get(',
                cPickStr.join(), ')-src.get(',
                dPickStr.join(), ')))}else{dst.set(',
              pickStr.join(), ',', bnd, ',0)};')
          } else {
            code.push('if(s[', bnd, ']>1){diff(', outStr,
                ',src.pick(', cPickStr.join(), ')', boundStr,
                ',src.pick(', dPickStr.join(), ')', boundStr,
                ');}else{zero(', outStr, ');};')
          }
        break

        case 'mirror':
          if(cod === 0) {
            code.push('dst.set(', pickStr.join(), ',', bnd, ',0);')
          } else {
            code.push('zero(', outStr, ');')
          }
        break

        case 'wrap':
          var aPickStr = pickStr.slice()
          var bPickStr = pickStr.slice()
          if(facet[i] < 0) {
            aPickStr[bnd] = 's[' + bnd + ']-2'
            bPickStr[bnd] = '0'

          } else {
            aPickStr[bnd] = 's[' + bnd + ']-1'
            bPickStr[bnd] = '1'
          }
          if(cod === 0) {
            code.push('if(s[', bnd, ']>2){dst.set(',
              pickStr.join(), ',', bnd, ',0.5*(src.get(',
                aPickStr.join(), ')-src.get(',
                bPickStr.join(), ')))}else{dst.set(',
              pickStr.join(), ',', bnd, ',0)};')
          } else {
            code.push('if(s[', bnd, ']>2){diff(', outStr,
                ',src.pick(', aPickStr.join(), ')', boundStr,
                ',src.pick(', bPickStr.join(), ')', boundStr,
                ');}else{zero(', outStr, ');};')
          }
        break

        default:
          throw new Error('ndarray-gradient: Invalid boundary condition')
      }
    }

    if(cod > 0) {
      code.push('};')
    }
  }

  //Enumerate ridges, facets, etc. of hypercube
  for(var i=0; i<(1<<d); ++i) {
    var faces = []
    for(var j=0; j<d; ++j) {
      if(i & (1<<j)) {
        faces.push(j+1)
      }
    }
    for(var k=0; k<(1<<faces.length); ++k) {
      var sfaces = faces.slice()
      for(var j=0; j<faces.length; ++j) {
        if(k & (1<<j)) {
          sfaces[j] = -sfaces[j]
        }
      }
      handleBoundary(sfaces)
    }
  }

  code.push('return dst;};return gradient')

  //Compile and link routine, save cached procedure
  var linkNames = [ 'diff', 'zero' ]
  var linkArgs  = [ centralDiff, zeroOut ]
  for(var i=1; i<=d; ++i) {
    linkNames.push('grad' + i)
    linkArgs.push(generateTemplate(i))
  }
  linkNames.push(code.join(''))

  var link = Function.apply(void 0, linkNames)
  var proc = link.apply(void 0, linkArgs)
  GRADIENT_CACHE[token] = proc
  return proc
}

function gradient(out, inp, bc) {
  if(Array.isArray(bc)) {
    if(bc.length !== inp.dimension) {
      throw new Error('ndarray-gradient: invalid boundary conditions')
    }
  } else if(typeof bc === 'string') {
    bc = dup(inp.dimension, bc)
  } else {
    bc = dup(inp.dimension, 'clamp')
  }
  if(out.dimension !== inp.dimension + 1) {
    throw new Error('ndarray-gradient: output dimension must be +1 input dimension')
  }
  if(out.shape[inp.dimension] !== inp.dimension) {
    throw new Error('ndarray-gradient: output shape must match input shape')
  }
  for(var i=0; i<inp.dimension; ++i) {
    if(out.shape[i] !== inp.shape[i]) {
      throw new Error('ndarray-gradient: shape mismatch')
    }
  }
  if(inp.size === 0) {
    return out
  }
  if(inp.dimension === 0) {
    out.set(0)
    return out
  }
  var cached = generateGradient(bc)
  return cached(out, inp)
}