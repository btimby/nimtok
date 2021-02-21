const ENCODER = new TextEncoder();
const DECODER = new TextDecoder();


function str2arr(s) {
  return ENCODER.encode(s);
}

function arr2str(a) {
  return DECODER.decode(a);
}


export {
  str2arr,
  arr2str
};
