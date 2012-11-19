/*
 Copyright (c) 2010-2012 Andrew Goodale. All rights reserved.
 
 Redistribution and use in source and binary forms, with or without modification, are
 permitted provided that the following conditions are met:
 
 1. Redistributions of source code must retain the above copyright notice, this list of
 conditions and the following disclaimer.
 
 2. Redistributions in binary form must reproduce the above copyright notice, this list
 of conditions and the following disclaimer in the documentation and/or other materials
 provided with the distribution.
 
 THIS SOFTWARE IS PROVIDED BY ANDREW GOODALE "AS IS" AND ANY EXPRESS OR IMPLIED
 WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> OR
 CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 
 The views and conclusions contained in the software and documentation are those of the
 authors and should not be interpreted as representing official policies, either expressed
 or implied, of Andrew Goodale.
 */ 

GAJavaScript = 
function () {

	/**
	 * Uses an iframe navigation to cause the UIWebViewDelegate to be called.
	 * The custom URL scheme identifies this request as the "trigger" to make Obj-C calls.
	 * Note that call happens asynchronously, so a script can queue several calls that will be invoked in order when the run loop is ready.
	 */
	function callScriptEngine () {
		var iframe = document.getElementById("gajavascript_frame");
		
		if (iframe === null) {
			iframe = document.createElement("iframe");
			iframe.id = "gajavascript_frame";
			iframe.style = "display: none";
			iframe.src = "ga-js:makeLotsaCalls";
			
			document.documentElement.appendChild(iframe);	// will make the callback happen
		}
		else {
			iframe.src = iframe.src;	// a kind of "refresh"
			
			// Experimental: The two statements below would cause Obj-C to be invoked synchronously.
//			document.documentElement.removeChild(iframe);
//			document.documentElement.appendChild(iframe);
		}
	}
	
return {
	ref: { 
		index: 0
	},
    
    calls: [],
    
    err: null,
	
	typeOf: function (value) {
		var t = typeof value;
		
		if (t === 'object') {
			if (value) {
				if (value instanceof Array) {
					t = 'array';
				}
				else if (value instanceof Date) {
					t = 'date';
				}
			} else {
				t = 'null';
			}
		}
		else if (t === 'function') {
			// Not sure why this is the case, but we want an object for NodeLists.
			if (value instanceof NodeList) {
				t = 'object';
			}
		}
		return t;
	},
	
	/**
	 * The JavaScript used for computing the "keys" for an object. 
	 * These are the named properties that are not functions.
	 */
	propsOf: function (obj) {
		var a = []; 
		
		for (var name in obj) { 
			if (typeof obj[name] != 'function') 
				a.push(name); 
		} 
		
		return this.valueToString(a);
	},
		
    /**
     * Returns a value with a special prefix that GAScriptEngine can use to convert the value
     * into the best matching Obj-C type.
     */
	valueToString: function (value) {
        var type = this.typeOf(value),
            self = this;
		
        function arrayToString (a) {
            var result = '';
            
            for (var i = 0; i < a.length; ++i) {
                if (i > 0) {
                    result += '\f';
                }
                
                // Return arrays inside arrays as objects, since the string syntax doesn't support nesting 
                if (self.typeOf(a[i]) === 'array') {
                    result += 'o:' + self.makeReference(a[i]);
                }
                else {
                    result += self.valueToString(a[i]);
                }
            }
            
            return result;
        }
        		
		if (type === 'undefined') {
			return 'u:';
		}
        else if (type === 'date') {
			return 'd:' + value.getTime();
		}
        else if (type === 'array') {
			return 'a:' + arrayToString(value);
		}
        else if (type === 'object') {
			return 'o:' + this.makeReference(value);
		}
        else if (type === 'null') {
			return 'x:';
		}
        
		return type.charAt(0) + ':' + value;		
	},
	
	callFunction: function (func, scope, argsArray) {
		try {
			return this.valueToString(func.apply(scope, argsArray));
		}
		catch (ex) {
            this.err = ex;
			return 'e:GAJavaScript.err';
		}
	},
    
    callFunctionOrGetValue: function (obj, key) {
        var v = obj[key];
        
        return (typeof v === 'function') ? this.callFunction(v, obj) : this.valueToString(v);
    },
	
	makeReference: function (obj) {
		var key = 'r' + this.ref.index++;
		
		this.ref[key] = obj;
		return "GAJavaScript.ref['" + key + "']";
	},
    
    performSelector: function (selName) {
        this.calls.push({
            sel: selName,
            args: Array.prototype.slice.call(arguments)     // Converts it to a true Array
        });
		
        callScriptEngine();
    },
	
	invocation: function (invocationHash) {
		
		return function () {
			GAJavaScript.calls.push({
				inv: invocationHash,
				args: Array.prototype.slice.call(arguments)     // Converts it to a true Array
			});

			callScriptEngine();
		};
	}
}
}();
