export function parseMaxStep(val) {
  let regex = /^[0-9]*$/;
  if (regex.test(val) && val < 5000 && val != '') return true
  else return false
}

export function parseIP(val) {
  let regex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (regex.test(val)) return true
  else return false
}

export function parseNoSpace(val) {
  let regex = /^\S*$/;
  if (regex.test(val)) return true
  else return false
}

export function parse20signs(val) {
  if (val.length <= 20 && val.length >= 1) return true
  else return false
}