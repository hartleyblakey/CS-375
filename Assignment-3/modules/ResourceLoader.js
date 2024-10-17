
function shaderPath(name, stage) {
    return "./Resources/Shaders/" + name + "." + stage;
}

class ResourceLoader {
    constructor() {
        if (ResourceLoader.instance) {
            throw new Error("Attempted to construct another ResourceLoader");
        }
        this.textRequests = new Set;
        this.loadedFiles = new Map;
        ResourceLoader.instance = this;
    }

    requestText(path) {
        this.textRequests.add(path);
    }

    requestShader(name) {
        this.requestText(shaderPath(name, "frag"));
        this.requestText(shaderPath(name, "vert"));
    }

    get(path) {
        let result = this.loadedFiles[path];
        if (!result) {
            alert("Failed to get resource at " + path);
        }
        return result;
    }
    
    getShader(name) {
        var res = Object();
        res.frag = this.get(shaderPath(name, "frag"));
        res.vert = this.get(shaderPath(name, "vert"));
        if (!res.frag || !res.vert) {
            alert("unable to find resource at " + path);
        }
        return res
    }

    async loadAll() {
        for (const path of this.textRequests) {
            this.loadedFiles[path] = await((await fetch(path, {cache: "no-cache"})).text());
        }
    }
}

const resourceLoader = new ResourceLoader();
Object.freeze(resourceLoader);

export default resourceLoader;
