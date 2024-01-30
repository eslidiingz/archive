/** @type {import('next').NextConfig} */

module.exports = {
  images: {
    domains: ["fileserver.merx.studio"],
  },
  reactStrictMode: true,
};

// const withImages = require("next-images");
// const withTM = require("next-transpile-modules")(["@madzadev/audio-player"]);
// module.exports = withImages(
//   withTM({
//     images: {
//       disableStaticImages: true,
//     },
//   })
// );
