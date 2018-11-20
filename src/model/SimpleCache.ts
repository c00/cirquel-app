export class SimpleCache {
    private cache: Cache = {};
    public defaultExpiryMinutes = 10;

    public has(key: string) {
        if (this.cache.hasOwnProperty(key)) {
            if (this.cache[key].isExpired()) {
                //should remove
                this.remove(key);
                return false;
            }
            //Key exists, and it's not expired.
            return true;
        }

        //Key doesn't exist.
        return false;
    }


    public get(key: string): Promise<any> {
        if (this.has(key)) {
            return this.cache[key].promise;
        }

        console.warn("Cache mismatch for key " + key);
        return null;
    }

    public add(key: string, promise: Promise<any>, expiryMinutes?: number): Promise<any> {
        if (this.has(key)) console.warn("Overwriting cache for key " + key);

        if (!expiryMinutes) expiryMinutes = this.defaultExpiryMinutes;

        this.cache[key] = new CacheItem(promise, expiryMinutes);
        return promise;
    }

    public remove(key: string) {
        if (this.cache.hasOwnProperty(key)) {
            delete this.cache[key];
        }
    }

}

export interface Cache {
    [key: string] : CacheItem;
}

export class CacheItem {
    expires: number;

    constructor(
        public promise: Promise<any>, 
        expiryMinutes: number
    ) {
        this.expires = + new Date() + (expiryMinutes * 6000);
    }

    public isExpired() {
        return + new Date() > this.expires;
    }
}