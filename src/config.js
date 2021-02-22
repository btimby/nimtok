export default {
  // This is a "private" server which allows us to swarm.
  SWARM_ADDR: '/ip4/127.0.0.1/tcp/9090/ws/p2p-webrtc-star',
  AVATAR: {
    WIDTH: 80,
    HEIGHT: 80,
    IMG_BASE: 'avatars/',
    IMG_NAME: 'avatar-{}.png',
    IMG_COUNT: 15,
  },
  IDENTICON: {
    WIDTH: 80,
    HEIGHT: 80,
  },
  PEER_KEY_OPTS: {
    bits: 1024,
    keyType: 'RSA',
  },
  // Public, world writable, shared DB.
  HASHTAG_DB: '/orbitdb/zdpuB31k3fJdQL1xtnawF8VJWiKGeWo7Z41TqT5MMsaLYexDj/hashtags',
};
