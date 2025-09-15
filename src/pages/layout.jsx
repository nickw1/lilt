import '/css/nwnotes.css';

export default function Layout({children}) {
    return(
    <html>
    <head>
    <title>LILT - Lightweight Interactive Learning Tool</title>
    </head>
    <body>
    <div id="root">
    {children}
    </div>
    </body>
    </html>
    );
}
// <link rel='stylesheet' type='text/css' href='https://code.cdn.mozilla.net/fonts/fira.css' />
