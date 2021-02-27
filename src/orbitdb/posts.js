import { VueOrbitStore } from '@/plugins/orbitdb';

const posts = new VueOrbitStore('posts', 'feed');

export default posts;
