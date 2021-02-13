// tslint:disable: variable-name
export class Note {
    constructor(
        private _id: string,
        private _title: string,
        private _content: string = '',
        private _createdAt: Date = new Date(),
        private _updatedAt: Date = new Date()
    ) { }

    get id(): string {
        return this._id;
    }

    get title(): string {
        return this._title;
    }

    get content(): string {
        return this._content;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }
}
