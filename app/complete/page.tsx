import type { Metadata } from "next";
import { Suspense } from "react";

import { CompleteThings } from "../_ui/complete-things/CompleteThings";

const CompletePage = () =>
    <section>
       <h1>Complete Things</h1>
       <Suspense>
          <CompleteThings />
       </Suspense>
    </section>;

export default CompletePage;

export const metadata: Metadata = {
  title: "Complete Things"
};
