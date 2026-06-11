// remotion/Root.tsx
// Register the Rebuzz Broll composition

import { Composition } from "remotion";
import { RebuzzBroll } from "./RebuzzBroll";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="RebuzzBroll"
        component={RebuzzBroll}
        durationInFrames={240}   // 8 seconds @ 30fps
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
