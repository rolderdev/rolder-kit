import { forwardRef, useEffect, useImperativeHandle } from "react";
import { type Props } from "./types";
import convertColor from "@packages/convertColor";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import * as Sentry from "@sentry/browser";
import initLocalDb from "./src/initLocalDb";
import useColorScheme from "./src/useColorScheme";

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
  const { sentryDsn } = Noodl.getProjectSettings();
  const { noodlNode, multiInstance, colorScheme: colorSchemeProp } = props;

  const localDbInited = initLocalDb(multiInstance)
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

  const { colorScheme, setColorScheme } = useColorScheme(noodlNode, colorSchemeProp)

  useImperativeHandle(
    ref,
    () => ({
      setColorScheme() {
        if (colorSchemeProp !== "auto") setColorScheme(colorSchemeProp)
      },
      toggleColorScheme() {
        if (colorSchemeProp !== "auto") setColorScheme(colorScheme === "light" ? "dark" : "light");
      },
    }),
    [colorSchemeProp, colorScheme]
  );

  return (
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: convertColor(colorScheme === "dark" ? "dark.7" : "gray.0"),
        }}
      >
        {localDbInited ? props.children : null}
      </div>
    </ErrorBoundary>
  )
});
