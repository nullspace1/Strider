interface Context<T> {
    context : T;
    updateContext : React.Dispatch<React.SetStateAction<T>>;
}

export {Context}