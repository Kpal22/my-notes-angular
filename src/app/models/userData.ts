// tslint:disable: variable-name
export class UserData {
    constructor(
        private _name: string,
        private _email: string
    ) { }

    get name(): string {
        return this._name;
    }

    get email(): string {
        return this._email;
    }
}
