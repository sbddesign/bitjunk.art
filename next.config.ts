import withMdkCheckout from "@moneydevkit/nextjs/next-plugin";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https" as const,
        hostname: "files.cdn.printful.com",
      },
    ],
  },
};

export default withMdkCheckout(nextConfig);
