import stringify from "json-stringify-pretty-compact"

window.myStringify = (x, options) => {
  return stringify(x, options)
}
