'use strict'

var dup = require('dup')

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

function compile(proc) {
  return CACHED_CWiseOp[proc.funcName]
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
}

function cwiseCompiler(user_args) {
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
    } else if(arg_type === "scalar") {
      proc.scalarArgs.push(i)
      proc.shimArgs.push("scalar" + i)
    } else if(arg_type === "index") {
      proc.indexArgs.push(i)
    } else if(arg_type === "shape") {
      proc.shapeArgs.push(i)
    } else if(typeof arg_type === "object" && arg_type.offset) {
      proc.argTypes[i] = "offset"
      proc.offsetArgs.push({ array: arg_type.array, offset:arg_type.offset })
      proc.offsetArgIndex.push(i)
    }
  }

  //Retrieve name
  proc.funcName = user_args.funcName || "cwise"

  return createThunk(proc)
}


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

function CACHED_link(diff, zero, grad1, grad2) {
  return function(dst, src) {
    var s = src.shape.slice()
    if (1 && s[0] > 2 && s[1] > 2) {
      grad2(
        src
          .pick(-1, -1)
          .lo(1, 1)
          .hi(s[0] - 2, s[1] - 2),
        dst
          .pick(-1, -1, 0)
          .lo(1, 1)
          .hi(s[0] - 2, s[1] - 2),
        dst
          .pick(-1, -1, 1)
          .lo(1, 1)
          .hi(s[0] - 2, s[1] - 2)
      )
    }
    if (1 && s[1] > 2) {
      grad1(
        src
          .pick(0, -1)
          .lo(1)
          .hi(s[1] - 2),
        dst
          .pick(0, -1, 1)
          .lo(1)
          .hi(s[1] - 2)
      )
      zero(
        dst
          .pick(0, -1, 0)
          .lo(1)
          .hi(s[1] - 2)
      )
    }
    if (1 && s[1] > 2) {
      grad1(
        src
          .pick(s[0] - 1, -1)
          .lo(1)
          .hi(s[1] - 2),
        dst
          .pick(s[0] - 1, -1, 1)
          .lo(1)
          .hi(s[1] - 2)
      )
      zero(
        dst
          .pick(s[0] - 1, -1, 0)
          .lo(1)
          .hi(s[1] - 2)
      )
    }
    if (1 && s[0] > 2) {
      grad1(
        src
          .pick(-1, 0)
          .lo(1)
          .hi(s[0] - 2),
        dst
          .pick(-1, 0, 0)
          .lo(1)
          .hi(s[0] - 2)
      )
      zero(
        dst
          .pick(-1, 0, 1)
          .lo(1)
          .hi(s[0] - 2)
      )
    }
    if (1 && s[0] > 2) {
      grad1(
        src
          .pick(-1, s[1] - 1)
          .lo(1)
          .hi(s[0] - 2),
        dst
          .pick(-1, s[1] - 1, 0)
          .lo(1)
          .hi(s[0] - 2)
      )
      zero(
        dst
          .pick(-1, s[1] - 1, 1)
          .lo(1)
          .hi(s[0] - 2)
      )
    }
    dst.set(0, 0, 0, 0)
    dst.set(0, 0, 1, 0)
    dst.set(s[0] - 1, 0, 0, 0)
    dst.set(s[0] - 1, 0, 1, 0)
    dst.set(0, s[1] - 1, 0, 0)
    dst.set(0, s[1] - 1, 1, 0)
    dst.set(s[0] - 1, s[1] - 1, 0, 0)
    dst.set(s[0] - 1, s[1] - 1, 1, 0)
    return dst
  }
}


function generateGradient(boundaryConditions) {
  var token = boundaryConditions.join()
  var proc = GRADIENT_CACHE[token]
  if(proc) {
    return proc
  }

  var d = boundaryConditions.length

  var linkArgs  = [ centralDiff, zeroOut ]
  for(var i=1; i<=d; ++i) {
    linkArgs.push(generateTemplate(i))
  }

  var link = CACHED_link

  var proc = link.apply(void 0, linkArgs)

  GRADIENT_CACHE[token] = proc
  return proc
}

module.exports = function gradient(out, inp, bc) {
  if(!Array.isArray(bc)) {
    if(typeof bc === 'string') {
      bc = dup(inp.dimension, bc)
    } else {
      bc = dup(inp.dimension, 'clamp')
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