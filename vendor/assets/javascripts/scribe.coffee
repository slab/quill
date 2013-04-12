#= require underscore
#= require eventemitter2
#= require linked_list
#= require rangy/rangy-core
#= require tandem-core
#= require tandem-core.module
#= require_tree ./scribe

# scribe/scribe will want to require('tandem-core') which in node.js will know to
# look in the tandem-core github repository. Rails sprockets does not do this and
# in fact it should not do anything since Tandem is already included in the above
# require. Thus we preemptively require it pointing to tandem-core.module.coffee
# as a workaround
window.Tandem = require('tandem-core')
window.Scribe = require('scribe/scribe')
