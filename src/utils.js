import mh from 'multihashes';
import b58 from 'b58';

const ENCODER = new TextEncoder();
const DECODER = new TextDecoder();

function isId(s) {
  // NOTE: QmViiHeEFRJE1FcN2K5QJnVxCND1bSAq2DZv8R1KeTLQCY
  try {
    mh.decode(b58.decode(s));
    return true;
  } catch (e) {
    return false;
  }
}

function str2arr(s) {
  return ENCODER.encode(s);
}

function arr2str(a) {
  return DECODER.decode(a);
}

function getHourBucket() {
  const d = new Date();
  const hour = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours()).getTime();
  // Adjust by TZ offset milliseconds (convert to UTC).
  return hour + d.getTimezoneOffset() * 60 * 1000;
}

function invert(o) {
  const inverted = {};
  const keys = Object.keys(o);
  const vals = Object.keys(o);

  for (let i = 0; i < keys.length; i++) {
    inverted[vals[i]] = keys[i];
  }

  return inverted;
}

export {
  str2arr,
  arr2str,
  isId,
  getHourBucket,
  invert,
};
