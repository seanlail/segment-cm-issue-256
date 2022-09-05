import Script from "next/script";
import { useEffect, useMemo, useState } from "react";

export function Segment() {
  const [client, setClient] = useState(false);

  const config = useMemo(() => {
    return ({ doNotTrack, inEU, preferences, React: CMReact }) => {
      const initialTrack = doNotTrack() !== true;

      preferences.onPreferencesSaved((p) => {
        console.log("onPreferencesSaved");
        console.log(JSON.stringify(p));
      });

      return {
        bannerActionsBlock: (props) =>
          CMReact.createElement(
            "button",
            { onclick: () => props.acceptAll() },
            "OK"
          ),
        bannerContent: CMReact.createElement(
          "span",
          null,
          "This site uses cookies"
        ),
        bannerSubContent: "Preferences",
        bannerHideCloseButton: true,
        cancelDialogTitle: "Are you sure you want to cancel?",
        cancelDialogContent: "Your preferences have not been saved.",
        container: "#segment-cookies",
        cookieName: "example-tracking-preferences",
        defaultDestinationBehavior: "enable",
        implyConsentOnInteraction: true,
        initialPreferences: {
          functional: initialTrack,
          marketingAndAnalytics: initialTrack,
          advertising: initialTrack,
        },
        preferencesDialogContent: "preferencesDialogContent",
        preferencesDialogTitle: "Preferences",
        shouldRequireConsent: inEU,
        writeKey: window.segmentKey,
      };
    };
  }, []);

  useEffect(() => {
    window.consentManagerConfig = config;
    setClient(true);
  }, [config]);

  if (!client) {
    return null;
  }

  if (!process.env.NEXT_PUBLIC_SEGMENT_APIKEY) {
    return null;
  }

  return (
    <>
      <Script
        async
        defer
        src="https://unpkg.com/@segment/consent-manager@5.6.0/standalone/consent-manager.js"
      ></Script>
      <Script
        id="segment-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.segmentKey='${process.env.NEXT_PUBLIC_SEGMENT_APIKEY}';!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._loadOptions=e};analytics._writeKey=window.segmentKey;analytics.SNIPPET_VERSION="4.15.3";analytics.page();}}();`,
        }}
      ></Script>
      <div id="segment-cookies"></div>
    </>
  );
}
