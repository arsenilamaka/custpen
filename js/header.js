export function drawingHeader(){
    const headerHTML = `<header class="header">
            <div class="header-panel">
                <nav class="nav">
                <div>
                    <h1><a href="/pages/index.html">CUSTPEN</a></h1>
                </div>
                <div class="nav-link">
                    <a href="/pages/projects/projects.html" class="nav-link">Projects</a>
                </div>
                <div class="nav-link">
                    <a href="/pages/collections/collections.html" class="nav-link">Collection</a>
                </div>
                <div class="nav-link">
                    <a href="/pages/custpen/custpen.html" class="nav-link"> Custpen</a>
                </div>
                <div class="nav-link">
                    <a href="/pages/library/library.html" class="nav-link"> Library</a>
                </div>
                <div class="nav-link">
                    <a href="/pages/spark/spark.html" class="nav-link">Spark</a>
                </div>
                <div>
                    <input type="checkbox" id="theme-toggle" class="toogle-switch"></input>
                </div>
            </nav>
            </div>
        </header>`;
        document.getElementById('placeToHeader').innerHTML=headerHTML;    
}

