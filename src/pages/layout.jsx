import '/css/Fira-4.202/fira.css';
import '/css/nwnotes.css';

export default function Layout({children}) {
    return(
    <html>
    <head>
    <title>LILT - Lightweight Interactive Learning Tool</title>
    </head>
    <body>
    {children}
    </body>
    </html>
    );
}
    //<link rel='stylesheet' type='text/css' href='https://code.cdn.mozilla.net/fonts/fira.css' />
