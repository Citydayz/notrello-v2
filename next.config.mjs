import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
