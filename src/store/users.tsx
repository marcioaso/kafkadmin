import { createSignal } from "solid-js";

export interface User {
    id?: number,
    name: string,
}
const {
    add: insert,
    find: select,
    findOne: selectOne,
    remove: del,
    replace: update

} = window.api.database

const [list, setList] = createSignal<User[]>([])

const [current, setCurrent] = createSignal({
    id:0,
    name:''
})
export {
    list,
    current,
    setCurrent
}

const refresh = async () => {
    const users = await select("profile")
    setList(users)
}

export const find = async(user:User):Promise<User[]> => {
    return await select("profile") as User[]
}

export const remove = async (userID:number):Promise<void> => {
    await del("profile",{id:userID})
    refresh()
}

export const add = async (user:User):Promise<void> => {
    await insert("profile",user)
    refresh()
}

export const replace = async (user:User):Promise<void> => {
    await update("profile",user)
    refresh()
}

// initializer 
refresh()