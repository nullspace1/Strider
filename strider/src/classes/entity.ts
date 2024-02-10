import { IDENTIFIER } from "./identifiers";

class Entity<T> {
    private data : T;
    private identifier : IDENTIFIER;

    constructor(data : T, identifier : IDENTIFIER){
        this.data = data;
        this.identifier = identifier;
    }

    getData() : T {
        return this.data
    }

    setData(data : T){
        this.data = data
    }

    getEntityIdentifier(){
        return IDENTIFIER[this.identifier];
    }
    

}

export {Entity}