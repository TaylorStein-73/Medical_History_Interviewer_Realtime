import React, { Suspense } from "react";
import { TranscriptProvider } from "@/app/contexts/TranscriptContext";
import { EventProvider } from "@/app/contexts/EventContext";
import { InterviewProvider } from "@/app/contexts/InterviewContext";
import App from "./App";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TranscriptProvider>
        <EventProvider>
          <InterviewProvider>
            <App />
          </InterviewProvider>
        </EventProvider>
      </TranscriptProvider>
    </Suspense>
  );
}
