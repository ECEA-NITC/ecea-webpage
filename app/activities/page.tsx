
import PostCard from "../components/post-card";

const samplePosts = [
  {
    title: "Introduction to Embedded Systems Workshop",
    date: new Date(2026, 8, 12),
    excerpt:
      "A two-day hands-on session covering microcontroller basics, sensor interfacing and firmware debugging.",
    href: "/posts/embedded-systems-workshop",
    image: null,
  },
  {
    title: "Talk: Careers in VLSI and Chip Design",
    date: new Date(2026, 7, 28),
    excerpt:
      "Alumni from the semiconductor industry shared how they moved from campus projects to design teams.",
    href: "/posts/vlsi-careers-talk",
    image: null,
  },
  {
    title: "ECEA Hardware Hackathon 2026",
    date: new Date(2026, 7, 3),
    excerpt:
      "Twelve teams built working prototypes in 24 hours, from smart meters to low-cost radio receivers.",
    href: "/posts/hardware-hackathon",
    image: null,
  },
  {
    title: "Signal Processing Reading Group",
    date: new Date(2026, 6, 15),
    excerpt:
      "Weekly sessions working through filter design and the Fourier transform with practical MATLAB examples.",
    href: "/posts/dsp-reading-group",
    image: null,
  },
  {
    title: "Signal Processing Reading Group",
    date: new Date(2026, 6, 15),
    excerpt:
      "Weekly sessions working through filter design and the Fourier transform with practical MATLAB examples.",
    href: "/posts/dsp-reading-group2",
    image: null,
  },
];


export default function ({posts = samplePosts}) {
  return (
    <section className="relative flex min-h-screen items-start overflow-hidden bg-paper pb-20 pt-28 px-8">
      <ul
        className="m-0 mt-8 grid list-none grid-cols-1 gap-x-4 gap-y-10 p-0 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4"
        aria-label="Latest posts"
      >
        {posts.map((post) => (
          <PostCard key={post.href} {...post} />
        ))}
      </ul>
    </section>
  );
}
