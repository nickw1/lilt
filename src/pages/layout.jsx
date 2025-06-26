export default function Layout({children}) {
	return(
	<html>
	<head>
	<title>LILT - Lightweight Interactive Learning Tool</title>
<link rel='stylesheet' type='text/css' href='https://code.cdn.mozilla.net/fonts/fira.css' />
<link rel='stylesheet' type='text/css' href='/css/nwnotes.css' />
	</head>
	<body>
	{children}
	</body>
	</html>
	);
}
	
