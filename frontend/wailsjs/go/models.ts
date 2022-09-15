export namespace main {
	
	export class NoteDocument {
	    id: string;
	    noteTitle: string;
	    pageURL: string;
	    imageURL: string;
	    note: number[];
	    tags: string[];
	    created_at: number;
	    updated_at: number;
	
	    static createFrom(source: any = {}) {
	        return new NoteDocument(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.noteTitle = source["noteTitle"];
	        this.pageURL = source["pageURL"];
	        this.imageURL = source["imageURL"];
	        this.note = source["note"];
	        this.tags = source["tags"];
	        this.created_at = source["created_at"];
	        this.updated_at = source["updated_at"];
	    }
	}

}

