import type { Metadata } from "next";
import { TenThings } from "./_ui/ten-things";

const IndexPage = () => <TenThings />;

export default IndexPage;

export const metadata: Metadata = {
  title: "Ten Things"
};
