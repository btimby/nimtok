const SWARM_ADDR = '/ip4/127.0.0.1/tcp/9090/ws/p2p-webrtc-star';
const AVATAR = {
  WIDTH: 80,
  HEIGHT: 80,
  IMG_BASE: 'avatars/',
  IMG_NAME: 'avatar-{}.png',
  IMG_COUNT: 15,
};
const IDENTICON = {
  WIDTH: 80,
  HEIGHT: 80,
};
const PEER_KEY_OPTS = {
  bits: 1024,
  keyType: 'RSA',
};

export default {
  SWARM_ADDR,
  AVATAR,
  IDENTICON,
  PEER_KEY_OPTS,
};
