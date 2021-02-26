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
    WIDTH: 24,
    HEIGHT: 24,
  },
  PEER_KEY_OPTS: {
    bits: 1024,
    keyType: 'RSA',
  },
  DISCOVER_WAIT: 10000,
  BUCKETS_RETAIN_HOURS: 4,
  BUCKETS_TRADE_COUNT: 10,
  PATTERN_EMAIL: /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  PATTERN_PASSWORD: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/,
  PATTERN_USERNAME: /^[-\w]+$/,
  USERNAME: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 20,
  },
  AVATAR_USE_GATEWAY: false,
  IPFS_GATEWAY_URL: 'https://ipfs.io/',
};
