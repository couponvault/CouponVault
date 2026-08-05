'use client';

export default function NativeAd() {
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; }
            </style>
        </head>
        <body>
            <script async="async" data-cfasync="false" src="https://pl30699560.effectivecpmnetwork.com/2f3f120cc58dbd153933e1e975c3e920/invoke.js"></script>
            <div id="container-2f3f120cc58dbd153933e1e975c3e920"></div>
        </body>
        </html>
    `;

    return (
        <div className="flex flex-col bg-white border border-appleBorder/60 rounded-2xl p-6 shadow-sm overflow-hidden min-h-[250px] items-center justify-center col-span-full w-full">
            <span className="text-[10px] text-appleMuted uppercase tracking-widest mb-2 font-semibold">Sponsored</span>
            <iframe
                title="Advertisement"
                srcDoc={htmlContent}
                className="w-full h-full min-h-[200px]"
                frameBorder="0"
                scrolling="no"
                sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
            />
        </div>
    );
}
