
// teeno same chij h bus alag alag use honge isliey alag alag banaya h

export const ROLE = {
    OWNER : "OWNER",
    ADMIN: "ADMIN",
    MANAGER :"MANAGER",
    MEMBER: "MEMBER",
    GUEST : "GUEST",
} as const;  //as a object at runtime for JS.

export type Role = (typeof ROLE)[keyof typeof ROLE]; // as a type at compile time for TS.
export const ROLES = Object.values(ROLE); // runtime array bana dega joh logic mein kaam aayega like mongoose schema mein.