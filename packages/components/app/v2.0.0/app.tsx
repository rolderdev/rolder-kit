import { forwardRef, useEffect } from "react";
import type { Props } from "./types";;
import { ErrorBoundary } from "react-error-boundary";
import * as Sentry from "@sentry/browser";
import initLocalDb from "./src/initLocalDb";
import systemLoaderAnimation from "@packages/system-loader-animation";

window.Sentry = Sentry

function FallbackComponent({ error }: any) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        padding: 64,
      }}
    >
      <h2 style={{ color: "red" }}>Системная ошибка!</h2>
      <h3>{error.message}</h3>
      <img
        src="error.jpg"
        style={{
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: 64,
          width: "50%",
        }}
      />
    </div>
  );
}

export default forwardRef(function (props: Props, ref) {
  const { sentryDsn, stopLoaderAnimationOn = 'dataInitialized' } = Noodl.getProjectSettings();
  const { noodlNode, multiInstance } = props;

  const localDbInited = initLocalDb(noodlNode, multiInstance)
  useEffect(() => {
    // logs
    if (sentryDsn) {
      Sentry.init({
        dsn: sentryDsn,
        transport: Sentry.makeBrowserOfflineTransport(Sentry.makeFetchTransport),
        tracesSampleRate: 0.01,
      });
    }
  }, [])

  useEffect(() => {
    if (localDbInited && stopLoaderAnimationOn === 'appInitialized') systemLoaderAnimation.stop()
  }, [localDbInited])

  return (
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      <div
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        {localDbInited ? props.children : null}
      </div>
    </ErrorBoundary>
  )
});
