// localStorage can throw or be missing (private mode, in-app browsers), so every access is guarded.
export const storage = {
    get(key) {
        try {
            return window.localStorage.getItem(key)
        } catch {
            return null
        }
    },
    set(key, value) {
        try {
            window.localStorage.setItem(key, value)
        } catch {
            // ignore — progress just won't be remembered
        }
    },
}
