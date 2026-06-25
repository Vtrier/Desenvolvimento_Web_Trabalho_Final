"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

export default function VLibras() {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (scriptLoaded) initWidget();
  }, [scriptLoaded]);

  function initWidget() {
    // @ts-expect-error - objeto global injetado pelo script oficial
    if (typeof window !== "undefined" && window.VLibras) {
      try {
        // @ts-expect-error - mesmo motivo acima
        new window.VLibras.Widget("https://vlibras.gov.br/app");
        console.log("[VLibras] Widget inicializado com sucesso.");
      } catch (err) {
        console.error("[VLibras] Erro ao inicializar:", err);
      }
    } else {
      console.warn("[VLibras] window.VLibras ainda não disponível.");
    }
  }

  return (
    <>
      <div
        dangerouslySetInnerHTML={{
          __html: `
            <div vw class="enabled">
              <div vw-access-button class="active"></div>
              <div vw-plugin-wrapper>
                <div class="vw-plugin-top-wrapper"></div>
              </div>
            </div>
          `,
        }}
      />

      <Script
        src="https://vlibras.gov.br/app/vlibras-plugin.js"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
        onError={() => console.error("[VLibras] Falha ao carregar o script externo.")}
      />
    </>
  );
}
