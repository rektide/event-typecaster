function makeEmit(ee, emit, map){
	return (function emit(o){
		var type= o['@type']
		if(type){

			// try resolving whole name
			var lookup= module.exports.map[type]
			if(map){
				var attempt= map[type]
				if(attempt)
					lookup= attempt
			}

			var real
			if(lookup){
				// resolved a type including a potential anchor- decompose the looked up
				var attempt2= tryReal(lookup)
				if(attempt2)
					real= attempt2
				else
					real= [lookup]
			}else{
				// failed to resolve a full type, but is there a anchor-less form that might resolve?
				var attempt3= tryReal(type)
				if(attempt3){
					// has an anchor- attempt to resolve
					lookup= module.exports.map[attempt3[0]]
					if(map){
						var attempt4= map[attempt3[0]]
						if(attempt4)
							lookup= attempt4
					}
					if(lookup){
						// anchorless version resolved!
						real= [lookup, attempt3[1]]
					}else{
						// anchored, unresolved
						real= attempt3
					}
				}else{
					// type is anchorless, never resolved
					real= [type]
				}
			}

			if(real[1])
				emit.call(this, real[0]+'#'+real[1], o)
			emit.call(this, real[0], o)
		}else{
			emit.apply(this, arguments)
		}
	})
}

function wrapEventEmitter(ee, map){
	var newEmit= makeEmit(ee, ee.emit, map)
	ee.emit= newEmit
	return ee
}

function tryReal(type){
	var hash= type.lastIndexOf('#')
	if(hash == -1)
		return
	return [type.substr(0, hash), type.substr(hash+1)]
}

module.exports= wrapEventEmitter
module.exports.makeEmit= makeEmit
module.exports.map= {}
