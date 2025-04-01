import autoCert from "anchor-pki/auto-cert/integrations/next";

const withAutoCert = autoCert({
  enabledEnv: "development",
});

const nextConfig = {
  /* config options here */
  // via.placeholder.com
  images: {
    domains: ["via.placeholder.com", "res.cloudinary.com","lh3.googleusercontent.com"],
  },
};


export default withAutoCert(nextConfig);
