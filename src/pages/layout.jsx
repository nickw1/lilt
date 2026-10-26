import '/css/nwnotes.css';

export default function Layout({children}) {
    return(
    <html>
    <head>
    <title>LILT - Lightweight Interactive Learning Tool</title>
    <link rel='stylesheet' type='text/css' href='https://code.cdn.mozilla.net/fonts/fira.css' />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.19.1/dist/katex.min.css" integrity="sha384-WwGtaC6ywCHxA5cstpj/3+xIZvTez8dq2IcBQaXRkenHZ7FVVq1ZROtURwfbtTlG" crossorigin="anonymous" />
    </head>
    <body>
    <div id="root">
    {children}
    </div>
    </body>
    </html>
    );
}
